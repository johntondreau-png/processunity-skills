#!/usr/bin/env python3
"""
ProcessUnity Reference Data Import via API
Bulk-creates Reference Data records using an Import Template.

SETUP: Copy config.json.example to config.json and fill in your credentials.
"""
import json, os, sys, urllib.request, urllib.parse

# ── Config ──────────────────────────────────────────────────────────────────
# Load credentials from config.json (same format as config.json.example)
CONFIG_PATH = os.environ.get("PU_CONFIG_PATH", os.path.join(os.path.dirname(__file__), "../../config.json"))
IMPORT_TEMPLATE_ID = os.environ.get("PU_IMPORT_TEMPLATE_ID", "258681")


def load_config():
    """Load PU credentials from config.json."""
    if not os.path.exists(CONFIG_PATH):
        print(f"ERROR: Config file not found at {CONFIG_PATH}")
        print("Copy config.json.example to config.json and fill in your credentials.")
        sys.exit(1)
    with open(CONFIG_PATH) as f:
        return json.load(f)["processunity"]


# ── Reference Data Records ──────────────────────────────────────────────────
# Format: each row must have columns matching the import template:
#   Name, Type, Description, External ID

def slug(text):
    """Create a URL-safe slug from text."""
    return text.upper().replace(" ", "_").replace("/", "_").replace("&", "AND").replace("-", "_").replace(",", "")

def build_rows():
    """Build all Reference Data rows for the 6 regulation-related types."""
    types = {
        "Jurisdiction": {
            "values": [
                "US", "US-NY", "US-CA", "US-MA", "EU", "UK", "International",
                "APAC", "Canada", "Australia", "Brazil", "India", "Singapore",
                "UAE", "South Africa", "Japan", "South Korea"
            ],
            "desc_prefix": "Geographic jurisdiction"
        },
        "Issuing Body": {
            "values": [
                "NIST", "AICPA", "ISO/IEC", "PCI SSC", "HHS/OCR",
                "European Parliament", "European Commission", "European Council",
                "NYDFS", "FFIEC", "OCC", "FRB", "FDIC", "CISA", "MITRE", "ENISA", "ICO"
            ],
            "desc_prefix": "Regulatory/standards issuing body"
        },
        "Regulation Type": {
            "values": ["Law", "Regulation", "Framework", "Standard", "Directive", "Guideline"],
            "desc_prefix": "Type of regulation or standard"
        },
        "Regulation Status": {
            "values": ["Active", "Draft", "Superseded", "Pending", "Under Review"],
            "desc_prefix": "Current status of regulation"
        },
        "Criticality": {
            "values": ["Critical", "High", "Medium", "Low", "Informational"],
            "desc_prefix": "Criticality/severity level"
        },
        "Threat Catalog": {
            "values": ["MITRE_ATTACK", "CWE"],
            "desc_prefix": "Threat catalog source"
        }
    }

    rows = []
    for type_name, info in types.items():
        type_slug = slug(type_name)
        for value in info["values"]:
            val_slug = slug(value)
            rows.append({
                "Name": value,
                "Type": type_name,
                "Description": f"{info['desc_prefix']}: {value}",
                "External ID": f"VS-RD-{type_slug}-{val_slug}"
            })
    return rows


def authenticate(config):
    """Get bearer token from PU OAuth endpoint."""
    data = urllib.parse.urlencode({
        "grant_type": config["grant_type"],
        "username": config["username"],
        "processunityUserName": config["processunityUserName"],
        "processunityPassword": config["processunityPassword"],
        "password": config["password"]
    }).encode("utf-8")
    req = urllib.request.Request(
        config["token_url"],
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        token_data = json.loads(resp.read().decode("utf-8"))
        return token_data["access_token"]


def import_data(config, token, rows):
    """Call the PU Import API with the given rows."""
    base_url = config["token_url"].rsplit("/token", 1)[0]
    import_url = f"{base_url}/api/importexport/Import/{IMPORT_TEMPLATE_ID}"

    body = {
        "data": rows,
        "param": {
            "IncludeLog": True
        }
    }
    payload = json.dumps(body).encode("utf-8")

    req = urllib.request.Request(
        import_url,
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    config = load_config()
    rows = build_rows()
    print(f"Built {len(rows)} Reference Data records across 6 types:")
    type_counts = {}
    for r in rows:
        t = r["Type"]
        type_counts[t] = type_counts.get(t, 0) + 1
    for t, c in type_counts.items():
        print(f"  {t}: {c} records")
    print()

    # Show first few rows as sample
    print("Sample rows:")
    for r in rows[:3]:
        print(f"  {json.dumps(r)}")
    print(f"  ... and {len(rows) - 3} more\n")

    # Authenticate
    print("Authenticating with ProcessUnity API...")
    try:
        token = authenticate(config)
        print(f"  Got bearer token ({len(token)} chars)\n")
    except Exception as e:
        print(f"  Authentication failed: {e}")
        sys.exit(1)

    # Import
    print(f"Importing {len(rows)} records via Import Template {IMPORT_TEMPLATE_ID}...")
    try:
        result = import_data(config, token, rows)
        print(f"\n=== Import Result ===")
        print(json.dumps(result, indent=2))

        # Summary
        if isinstance(result, dict):
            data = result.get("Data", result)
            added = data.get("TotalAddedRecords") or data.get("TotalInsertRecords") or 0
            updated = data.get("TotalUpdatedRecords") or data.get("TotalUpdateRecords") or 0
            total = data.get("TotalRecords", 0)
            has_error = result.get("HasError") or result.get("HasErrors") or False
            message = result.get("Message", "")
            print(f"\nSummary: {added} added, {updated} updated, {total} total records processed")
            if has_error:
                print(f"ERROR: {message}")
            else:
                print("Import completed successfully!")
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8") if e.readable() else ""
        print(f"  HTTP {e.code}: {e.reason}")
        print(f"  Response: {error_body}")
        sys.exit(1)
    except Exception as e:
        print(f"  Import failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

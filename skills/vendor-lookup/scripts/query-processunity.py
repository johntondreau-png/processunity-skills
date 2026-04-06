#!/usr/bin/env python3
"""ProcessUnity Vendor Lookup Script - uses urllib (no curl dependency)"""
import json, sys, urllib.request, urllib.parse

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: query-processunity.py <vendor_name> <config_path>"}))
        sys.exit(1)

    vendor_name = sys.argv[1]
    config_path = sys.argv[2]

    # Read config
    with open(config_path) as f:
        config = json.load(f)["processunity"]

    # Step 1: Authenticate
    auth_data = urllib.parse.urlencode({
        "grant_type": config["grant_type"],
        "username": config["username"],
        "processunityUserName": config["processunityUserName"],
        "processunityPassword": config["processunityPassword"],
        "password": config["password"]
    }).encode("utf-8")

    auth_req = urllib.request.Request(
        config["token_url"],
        data=auth_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(auth_req, timeout=20) as resp:
            token_data = json.loads(resp.read().decode("utf-8"))
            token = token_data["access_token"]
    except Exception as e:
        print(json.dumps({"error": "Authentication failed", "details": str(e)}))
        sys.exit(1)

    # Step 2: Query report
    report_req = urllib.request.Request(
        config["report_url"],
        data=b"{}",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(report_req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(json.dumps({"error": "Failed to query report", "details": str(e)}))
        sys.exit(1)

    if data.get("HasError"):
        print(json.dumps({"error": "Report query failed", "message": data.get("Message", "")}))
        sys.exit(1)

    records = data.get("Data", [])
    search_lower = vendor_name.lower()

    # Find matches (case-insensitive, partial match)
    matches = [r for r in records if search_lower in r.get("Third-Party Name", "").lower()]

    # Fuzzy fallback: match any word
    if not matches:
        words = search_lower.split()
        matches = [r for r in records if any(w in r.get("Third-Party Name", "").lower() for w in words)]

    result = {
        "search_term": vendor_name,
        "matches_found": len(matches),
        "total_vendors_in_report": len(records),
        "vendors": matches
    }
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()

import json

def handler(request):
    leads = [
        {"id": "L-1001", "name": "Ritual Pilates", "source": "LinkedIn", "status": "New"},
        {"id": "L-1002", "name": "Global Group Travel", "source": "Referral", "status": "Qualified"},
        {"id": "L-1003", "name": "Cayuga", "source": "Website", "status": "Contacted"},
    ]
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"leads": leads})
    }

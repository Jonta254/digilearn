# Automation test plan

| Test | Fictional input | Expected result | Recovery step | Evidence |
|---|---|---|---|---|
| Valid record | Complete project request | Create one reviewed task | Remove duplicate | Run log |
| Missing email | Blank contact field | Stop and request review | Correct source record | Validation message |
| Service unavailable | Simulated 503 response | Retry once, then queue | Process queue manually | Timestamped log |

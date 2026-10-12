# Local test transport only: calls the real migrated PostgreSQL intake as anon.
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
import json, subprocess, uuid, base64
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args): pass
 def do_GET(self):
  self.send_response(200);self.send_header('Content-Type','application/json');self.end_headers();self.wfile.write(b'[]')
 def do_POST(self):
  if self.path != '/rest/v1/rpc/submit_website_request': self.send_error(404);return
  data=json.loads(self.rfile.read(int(self.headers['Content-Length'])))
  key=str(uuid.UUID(data['p_key'])); encoded=base64.b64encode(json.dumps(data['p_payload']).encode()).decode()
  sql=f"set role anon; select public.submit_website_request('{key}',convert_from(decode('{encoded}','base64'),'UTF8')::jsonb);"
  r=subprocess.run(['psql','postgresql://postgres@127.0.0.1:55439/postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],input=sql,text=True,capture_output=True)
  self.send_response(200 if r.returncode==0 else 400);self.send_header('Content-Type','application/json');self.end_headers()
  self.wfile.write(json.dumps(r.stdout.strip() if r.returncode==0 else {'code':'P0001','message':r.stderr}).encode())
ThreadingHTTPServer(('127.0.0.1',55440),Handler).serve_forever()

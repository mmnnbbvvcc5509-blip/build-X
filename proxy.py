import http.server
import socketserver
import urllib.request
import urllib.error
import urllib.parse
import sys

PORT = 12001
TARGET_URL = "http://localhost:19006"

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        url = TARGET_URL + self.path
        try:
            response = urllib.request.urlopen(url)
            self.send_response(response.status)
            for header in response.getheaders():
                if header[0].lower() != 'transfer-encoding':
                    self.send_header(header[0], header[1])
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(response.read())
        except urllib.error.URLError as e:
            self.send_error(500, str(e))
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        url = TARGET_URL + self.path
        
        req = urllib.request.Request(url, data=post_data, method='POST')
        for header in self.headers:
            if header.lower() not in ['host', 'content-length']:
                req.add_header(header, self.headers[header])
        
        try:
            response = urllib.request.urlopen(req)
            self.send_response(response.status)
            for header in response.getheaders():
                if header[0].lower() != 'transfer-encoding':
                    self.send_header(header[0], header[1])
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(response.read())
        except urllib.error.URLError as e:
            self.send_error(500, str(e))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
        self.end_headers()

print(f"Starting proxy server on port {PORT}, forwarding to {TARGET_URL}")
httpd = socketserver.TCPServer(("0.0.0.0", PORT), ProxyHandler)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("Shutting down proxy server")
    httpd.shutdown()
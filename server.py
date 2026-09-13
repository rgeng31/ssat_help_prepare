#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8080

class SSATServerHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/save-csv':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                base_dir = os.path.dirname(os.path.abspath(__file__))
                csv_path = os.path.join(base_dir, 'vocabulary_bank.csv')
                with open(csv_path, 'wb') as f:
                    f.write(post_data)
                
                resp_body = b'{"success": true, "message": "vocabulary_bank.csv saved directly to disk"}'
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(resp_body)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Connection', 'close')
                self.end_headers()
                self.wfile.write(resp_body)
                self.wfile.flush()
                self.close_connection = True
                print(f"[SERVER] Successfully saved updated vocabulary_bank.csv to disk ({len(post_data)} bytes)", flush=True)
            except Exception as e:
                err_body = f'{{"success": false, "error": "{str(e)}"}}'.encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err_body)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Connection', 'close')
                self.end_headers()
                self.wfile.write(err_body)
                self.wfile.flush()
                self.close_connection = True
        else:
            self.send_error(404, "Endpoint not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Length', '0')
        self.send_header('Connection', 'close')
        self.end_headers()
        self.wfile.flush()
        self.close_connection = True

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server_address = ('', PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, SSATServerHandler)
    print(f"==================================================", flush=True)
    print(f" SSAT Verbal Helper Server Running on Port {PORT}", flush=True)
    print(f" Direct CSV File Saving Active: http://localhost:{PORT}", flush=True)
    print(f"==================================================", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

#!/bin/bash
# МастерОК - Final Server Setup with systemd

echo "🚀 МастерОК Final Server Setup"

# 1. Kill existing processes
echo "⏹️  Stopping existing processes..."
pkill -f "uvicorn app.main_simple:app"
pkill -f "npm start"

# 2. Setup Backend systemd service
echo "🔧 Setting up Backend service..."
sudo tee /etc/systemd/system/masterok-backend.service > /dev/null << 'EOF'
[Unit]
Description=МастерОК Backend API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/masterok-platform/backend
Environment="PATH=$HOME/masterok-platform/backend/venv/bin"
ExecStart=$HOME/masterok-platform/backend/venv/bin/uvicorn app.main_simple:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 3. Setup Frontend systemd service
echo "🔧 Setting up Frontend service..."
sudo tee /etc/systemd/system/masterok-frontend.service > /dev/null << 'EOF'
[Unit]
Description=МастерОК Frontend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/masterok-platform/landing
Environment="PATH=/usr/bin:/usr/local/bin"
Environment="NODE_ENV=production"
Environment="NEXT_PUBLIC_API_URL=http://localhost:8000"
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 4. Replace $USER and $HOME with actual values
sudo sed -i "s|\$USER|$USER|g" /etc/systemd/system/masterok-backend.service
sudo sed -i "s|\$HOME|$HOME|g" /etc/systemd/system/masterok-backend.service
sudo sed -i "s|\$USER|$USER|g" /etc/systemd/system/masterok-frontend.service
sudo sed -i "s|\$HOME|$HOME|g" /etc/systemd/system/masterok-frontend.service

# 5. Nginx configuration
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/masterok > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    client_max_body_size 50M;

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }

    location /docs {
        proxy_pass http://127.0.0.1:8000/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/masterok /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 6. Reload systemd and start services
echo "🔄 Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable masterok-backend
sudo systemctl enable masterok-frontend
sudo systemctl restart masterok-backend
sudo systemctl restart masterok-frontend

# 7. Test Nginx and restart
echo "✅ Testing Nginx..."
sudo nginx -t && sudo systemctl restart nginx

# 8. Wait and check status
sleep 5

echo ""
echo "📊 Service Status:"
sudo systemctl status masterok-backend --no-pager -l | head -15
echo ""
sudo systemctl status masterok-frontend --no-pager -l | head -15
echo ""

# 9. Show logs
echo "📝 Recent Backend Logs:"
sudo journalctl -u masterok-backend -n 20 --no-pager

echo ""
echo "📝 Recent Frontend Logs:"
sudo journalctl -u masterok-frontend -n 20 --no-pager

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ МастерОК DEPLOYED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Access your platform:"
echo "   Frontend:  http://YOUR_SERVER_IP/"
echo "   API Docs:  http://YOUR_SERVER_IP/docs"
echo "   Backend:   http://YOUR_SERVER_IP/api/v1/"
echo ""
echo "📊 Useful commands:"
echo "   sudo systemctl status masterok-backend"
echo "   sudo systemctl status masterok-frontend"
echo "   sudo journalctl -u masterok-backend -f"
echo "   sudo journalctl -u masterok-frontend -f"
echo ""





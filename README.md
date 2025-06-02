
# H&W Publishing - Teste Técnico Infraestrutura e DevOps

📌 **Descrição**

Este repositório contém a solução para o teste técnico de Infraestrutura e DevOps da **H&W Publishing**. O objetivo foi:

✅ Criar um ambiente virtual local com Linux (Ubuntu)  
✅ Configurar uma pipeline CI/CD usando GitHub Actions  
✅ Implementar balanceamento de carga com Nginx  
✅ Garantir a organização e funcionamento de todas as etapas.

---

## 🚀 Fases do Projeto

### 1️⃣ Configuração da Máquina Virtual

Foram criadas duas máquinas virtuais no **Proxmox**:

| VM                       | IP          | Função                                                              |
| ------------------------ | ----------- | ------------------------------------------------------------------- |
| **DEVOPS-HW-PUBLISHING** | 10.124.0.25 | Produção (Nginx + GitHub Actions Runner + Node.js)                  |
| **DEVOPS-DESENV**        | 10.124.0.19 | Ambiente de desenvolvimento e deploy                                |

**Sistema Operacional:** Ubuntu Server

**Funções:**

✅ **DEVOPS-HW-PUBLISHING:**  
- Nginx  
- Git  
- Node.js  
- NPM  
- PM2  
- GitHub Actions Runner

✅ **DEVOPS-DESENV:**  
- Git  
- Node.js  
- NPM  
- PM2  

---

### 📌 Observações Importantes

✅ **DEVOPS-HW-PUBLISHING:**  
- Atua como ambiente de produção.  
- Executa o GitHub Actions Runner localmente para pipelines automatizadas.  
- Possui Nginx configurado para balanceamento de carga.  
- Recebe o código do GitHub e executa build, testes e deploy via pipeline.

✅ **DEVOPS-DESENV:**  
- Ambiente de desenvolvimento e testes locais.  
- Desenvolvedores validam alterações nesta máquina antes do push.

---

### 2️⃣ Estrutura do Projeto

```plaintext
/opt/hw-devops-test
├── app/
│   ├── app.js
│   ├── app.test.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── ecosystem.config.js
├── .github/
│   └── workflows/
│       └── ci-cd.yml
└── README.md
```

---

## 🚀 Pipeline CI/CD

Implementada usando **GitHub Actions**, localizada em:
`.github/workflows/ci-cd.yml`

**Passos da Pipeline:**
1️⃣ Checkout do código  
2️⃣ Instalação das dependências  
3️⃣ Execução de testes automatizados (Jest)  
4️⃣ Instalação global do PM2  
5️⃣ Deploy da aplicação via PM2

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: self-hosted

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Instalar dependências
        run: |
          cd app
          npm install

      - name: Rodar testes
        run: |
          cd app
          npm test

      - name: Garantir pm2 instalado globalmente
        run: |
          npm install -g pm2

      - name: Rodar aplicação (PM2)
        run: |
          cd app
          pm2 start server.js --name hw-devops-test || pm2 restart hw-devops-test
```

---

## ⚡ Configuração do GitHub Actions Runner

Configurado como serviço na máquina de produção (**DEVOPS-HW-PUBLISHING**).

**Instalação e inicialização:**

```bash
cd /opt/actions-runner
./config.sh --unattended --url https://github.com/<user>/<repo> --token <token>

sudo ./svc.sh install
sudo systemctl start actions.runner.ivandrailvomevanio-hw-devops-test.DEVOPS-HW-PUBLISHING.service
sudo systemctl enable actions.runner.ivandrailvomevanio-hw-devops-test.DEVOPS-HW-PUBLISHING.service
sudo systemctl status actions.runner.ivandrailvomevanio-hw-devops-test.DEVOPS-HW-PUBLISHING.service
```

---

## ⚙️ Configuração do Nginx

Configurado para balancear entre duas instâncias Node.js:

`/etc/nginx/conf.d/hw.conf`

```nginx
upstream myapp {
    server 127.0.0.1:3000 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=10s;
}

server {
    listen 80 default_server;
    server_name _;
    access_log /var/log/nginx/myapp.log;
    error_log /var/log/nginx/myapp_error.log;

    location / {
        proxy_pass http://myapp;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 🟢 Execução da Aplicação

```bash
cd /opt/hw-devops-test/app
npm install
npm start
```

Aplicação disponível em:
- http://10.124.0.25:3000
- http://10.124.0.25:3001
- http://10.124.0.25 (via Nginx)

---

## ✅ Testes Automatizados

Na VM de desenvolvimento (DEVOPS-DESENV):

```bash
npm test
```

Saída esperada:

```bash
PASS  ./app.test.js
  GET /
    ✓ should return 200 OK
```

---

## 📋 Visualização do Log de Deploy

Para logs do **GitHub Actions Runner**:

```bash
sudo journalctl -u actions.runner.ivandrailvomevanio-hw-devops-test.DEVOPS-HW-PUBLISHING.service -f
```

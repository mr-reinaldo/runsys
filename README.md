
# RunSys

RunSys é uma idéia de projeto para disciplina de Desenvolvimento Web do IFPB - Campus João Pessoa. Está aplicação é uma solução para automatização de alguns processos de configuração de ativos de redes (Routers, Switchs) facilitando a vida do administrador.

## Screenshots

![App Screenshot](./screenshots/dashboard.png)

![App Screenshot](./screenshots/ativos.png)

![App Screenshot](./screenshots/usuarios.png)

![App Screenshot](./screenshots/gerenciamento.png)

## Live Preview

[![MIT License](https://img.shields.io/badge/Live-Preview-green.svg)](https://dw-runsys.mr-reinaldo.repl.co/)

## Funcionalidades

- Início.
  - Chart do trafico de rede.
  - Status de uso de Memoria e CPU.
  - Uptime do servidor.
  - Card com informações do sistema operacional.
- Ativos de Rede.
  - CRUD para ativos de redes.
- Usuários
  - CRUD para usuários.
- Gerenciamento.  
  - Terminal Simples para conexão SSH.

## Stack utilizada

**Front-end:** HTML, CSS, Boostrap, Javascript.

**Back-end:** Node, Express, Sequelize, SSH2, bcrypt, crypto-js, systeminformation, ejs, sqlite3, dotenv.

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`PORT_PROJECT`

`SECRET_KEY`

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/mr-reinaldo/DW-RunSys.git
```

Entre no diretório do projeto

```bash
  cd DW-RunSys
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run start
```

### 👨‍💻 Equipe:

<table>
  <tr>
	  <td align="center">
		<a href="https://github.com/mr-reinaldo">
		<img style="border-radius: 50%;" 
			src="https://avatars.githubusercontent.com/u/88012242?v=4" 
		     	width="100px;" 
		     	alt="José Reinaldo"/>
			<br />
			<sub><b>José Reinaldo</b></sub>
		  </a><br /><a href="https://github.com/mr-reinaldo" title="mr-reinaldo">👨‍🚀</a>
	  </td>
	  <td align="center">
		<a href="https://github.com/mjldl">
		<img style="border-radius: 50%;" 
			src="https://avatars.githubusercontent.com/u/96328462?v=4" 
		     	width="100px;" 
		     	alt="Matheus Jabes"/>
			<br />
			<sub><b>Matheus Jabes</b></sub>
		  </a><br /><a href="https://github.com/mjldl" title="mjldl">👨‍🚀</a>
	  </td>
	  <td align="center">
		<a href="https://github.com/joseroldao27062002">
		<img style="border-radius: 50%;" 
			src="https://avatars.githubusercontent.com/u/59697831?v=4" 
		     	width="100px;" 
		     	alt="José Roldão"/>
			<br />
			<sub><b>José Roldão</b></sub>
		  </a><br /><a href="https://github.com/joseroldao27062002" title="joseroldao27062002">👨‍🚀</a>
	  </td>
  </tr>
</table>
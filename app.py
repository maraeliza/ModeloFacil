from flask import Flask, render_template, request, jsonify
from sendEmail import * 
import os
import requests
from werkzeug.utils import secure_filename
app = Flask(__name__)



upload_folder = os.getcwd() + '/uploads'
app.config['UPLOAD_FOLDER'] = upload_folder

@app.route('/sendEmail', methods=['POST'])
def send_email():
    try:
        arquivos_salvos = []
        resposta = []
        data = request.get_json()

        if not data or 'files' not in data:
            print("Nenhum link de arquivo")
            return jsonify({"error": "Nenhum link de arquivo fornecido"}), 400

        print("TIPO DA REQUISIÇÃO", request.content_type)
        links = data['files']
        print(links)
        
        for link in links:
            print(link)
            if not link:
                resposta.append("Erro ao adicionar anexo")
                resposta.append("Arquivo não encontrado!")
                continue

            filename = link.split("/")[-1].split("?")[0]
            print(filename)
            filename = secure_filename(filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            print(file_path)
            response = requests.get(link)

            if response.status_code == 200:
                print("Download feito com sucesso")
                with open(file_path, 'wb') as f:
                    f.write(response.content)
                arquivos_salvos.append(file_path)
                print(f"Arquivo salvo em : {file_path}")
            else:
                print(f"Falha ao baixar arquivo: {response.status_code} \n link {link}")

        destinatario = data.get("destinatario")
        useremail = data.get("userEmail")
        usersenha = data.get("userSenha")
        assunto = data.get("assunto")
        email = data.get("email")
        cc = data.get("cc")

        resposta = enviarEmail(destinatario, assunto, cc, email, useremail, usersenha, arquivos_salvos)
        print("RESULTADO: ", resposta[0])
        
        # Remove arquivos salvos
        if arquivos_salvos:
            for file in arquivos_salvos:
                try:
                    print()
                    os.remove(file)
                except Exception as e:
                    print(f"Erro ao remover arquivo: {e}")

        print("Exibindo valor de text")
        print(resposta)
        
        # Ajusta a resposta JSON
        if isinstance(resposta, list):
            response_data = {"result": resposta}
        else:
            response_data = {"result": [resposta]}
        
        return jsonify(response_data)

    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        resposta.append("Erro ao enviar email")
        resposta.append(str(e))
        
        return jsonify({"error": resposta}), 500

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/index.html')
def index2():
    return render_template('index.html')

@app.route('/email.html')
def email():
    return render_template('email.html')

@app.route('/perfil.html')
def perfil():
    return render_template('perfil.html')


@app.route('/duvidas.html')
def tirarDuvidas():
    return render_template('duvidas.html')

if __name__ == '__main__':
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    app.run(debug=True)

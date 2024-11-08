import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os

def enviarEmail(destinatario, assunto, cc, email, userEmail, userSenha, arquivos):
    resultados = []
    print("ASSUNTO: ", assunto)
    
    try:
        # Criação da mensagem
        msg = MIMEMultipart()
        msg['From'] = userEmail

        # Verifica se destinatario e cc são listas e converte para strings se necessário
        if isinstance(destinatario, list):
            destinatario_str = ', '.join(destinatario)
        else:
            destinatario_str = destinatario

        if isinstance(cc, list):
            cc_str = ', '.join(cc)
        else:
            cc_str = cc

        msg['To'] = destinatario_str
        msg['Cc'] = cc_str
        msg['Subject'] = assunto

        # Corpo do e-mail
        msg.attach(MIMEText(email, 'html'))

        # Anexar arquivos
        if arquivos:
            for arquivo_path in arquivos:
                print(f"Adicionando anexo: {arquivo_path}")
                try:
                    with open(arquivo_path, 'rb') as arquivo:
                        part = MIMEBase("application", "octet-stream")
                        part.set_payload(arquivo.read())
                        encoders.encode_base64(part)
                        part.add_header(
                            "Content-Disposition",
                            f"attachment; filename={os.path.basename(arquivo_path)}",
                        )
                        msg.attach(part)
                except Exception as e:
                    print(f"Erro ao adicionar anexo: {e}")

        # Conectar ao servidor SMTP e enviar e-mail
        try:
            print("Conectando ao servidor SMTP")
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(userEmail, userSenha)

                # Combina destinatarios e ccs
                dests = destinatario if isinstance(destinatario, list) else [destinatario]
                ccs = cc if isinstance(cc, list) else [cc]
                dests.extend(ccs)

                print("Enviando e-mail")
                server.sendmail(userEmail, dests, msg.as_string())
                print("E-mail enviado com sucesso!")
                resultados.append('success')
                return resultados

        except smtplib.SMTPAuthenticationError as e:
            print("Erro de autenticação: Verifique suas credenciais de acesso do seu email em 'Meu Perfil' e tente novamente.")
            resultados.append('Erro de autenticação')
            resultados.append('Verifique suas credenciais de acesso do seu email em "Meu Perfil" e tente novamente.')
            resultados.append(str(e))
            return resultados

        except smtplib.SMTPConnectError as e:
            print("Erro de conexão: Não foi possível conectar ao servidor de e-mail.")
            resultados.append('Erro de conexão')
            resultados.append('Não foi possível conectar ao servidor de e-mail.')
            resultados.append(str(e))
            return resultados

        except smtplib.SMTPRecipientsRefused as e:
            print("Erro de destinatário: O destinatário foi recusado.")
            resultados.append('Erro de destinatário')
            resultados.append('O destinatário foi recusado.')
            resultados.append(str(e))
            return resultados

        except smtplib.SMTPException as e:
            print("Erro no envio do e-mail: Tente novamente mais tarde.")
            resultados.append('Erro no envio do e-mail')
            resultados.append('Não foi possível enviar o e-mail. Tente novamente mais tarde.')
            resultados.append(str(e))
            return resultados

        except Exception as e:
            print("Erro inesperado: Tente novamente mais tarde.")
            resultados.append('Erro inesperado')
            resultados.append('Tente novamente mais tarde.')
            resultados.append(str(e))
            return resultados

    except Exception as e:
        print("Erro inesperado: Tente novamente mais tarde.")
        resultados.append('Erro inesperado')
        resultados.append('Tente novamente mais tarde.')
        resultados.append(str(e))
        return resultados

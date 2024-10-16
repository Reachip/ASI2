import stomp

# Définir les détails de connexion
ACTIVEMQ_HOST = 'localhost'  # Remplacez par l'adresse de votre serveur ActiveMQ
ACTIVEMQ_PORT = 61613          # Port par défaut pour STOMP
USERNAME = 'myuser'            # Nom d'utilisateur
PASSWORD = 'mypwd'             # Mot de passe
QUEUE_NAME = '/queue/generation/text'  # Remplacez par le nom de votre queue

# Créer une connexion
conn = stomp.Connection([(ACTIVEMQ_HOST, ACTIVEMQ_PORT)])
conn.connect(USERNAME, PASSWORD, wait=True)

# Publier un message dans la queue
message = 'Hello, ActiveMQ!'
conn.send(body=message, destination=QUEUE_NAME)
print('Message publié dans la queue: {}'.format(message))

# Déconnecter
conn.disconnect()
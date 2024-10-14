# ASI-ATELIER-1

## Question 1.1

![Diagramme de séquence du workflow de traitement](docs/card-generation-sequence-diagram.svg)

![Diagramme d’architecture répondant aux exigences du SOA](docs/soa-card-generation-architecture.svg)


## Question 1.2

| Nom | Description | Avantages | Inconvénients | Cas d'utilisation typiques |
|-----|-------------|-----------|---------------|----------------------------|
| Apache Kafka | Plateforme de streaming distribuée | - Haute performance<br>- Scalabilité horizontale<br>- Persistance des données | - Complexité de configuration<br>- Courbe d'apprentissage élevée | - Traitement de flux en temps réel<br>- Ingestion de données à grande échelle |
| RabbitMQ | Broker de messages | - Facile à utiliser<br>- Protocoles multiples (AMQP, MQTT, etc.)<br>- Bonnes performances | - Scalabilité limitée par rapport à Kafka<br>- Persistance des messages moins robuste | - Communication asynchrone entre services<br>- Systèmes de file d'attente |
| Apache ActiveMQ | Broker de messages open-source | - Supporte de nombreux protocoles<br>- Flexible et extensible<br>- Bonne intégration avec Java | - Performances moyennes pour des charges très élevées<br>- Configuration complexe pour des cas avancés | - Intégration d'applications d'entreprise<br>- Systèmes de messaging JMS |
| NATS | Système de messagerie léger et haute performance | - Très rapide et léger<br>- Simple à utiliser<br>- Supporte les modèles pub/sub et requête/réponse | - Fonctionnalités moins avancées que d'autres solutions<br>- Persistance limitée | - Communication en temps réel<br>- IoT et systèmes embarqués |
| ZeroMQ | Bibliothèque de messagerie distribuée | - Très léger et rapide<br>- Pas besoin de broker central<br>- Flexible et personnalisable | - Nécessite plus de développement pour des fonctionnalités avancées<br>- Pas de persistance intégrée | - Communication inter-processus<br>- Systèmes distribués personnalisés |
| Google Pub/Sub | Service de messagerie géré dans le cloud | - Entièrement géré et scalable<br>- Intégration facile avec d'autres services Google Cloud<br>- Latence globale faible | - Verrouillage du fournisseur (vendor lock-in)<br>- Coûts potentiellement élevés à grande échelle | - Applications cloud natives<br>- Analyses en temps réel |
| AWS SNS/SQS | Services de messagerie d'Amazon Web Services | - Haute disponibilité et durabilité<br>- Intégration facile avec d'autres services AWS<br>- Modèles pub/sub (SNS) et file d'attente (SQS) | - Verrouillage du fournisseur<br>- Coûts potentiellement élevés à grande échelle | - Applications serverless<br>- Architectures découplées dans AWS |

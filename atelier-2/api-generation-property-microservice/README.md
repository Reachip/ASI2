## Installer colorToproperties-1.1.2

Usage de la Librairie pour évaluer les attributs

- Récupérer le jar depuis les ressources mises à disposition
- Installer en local en tant que package maven sur votre machine the jar en question

```
mvn install:install-file -Dfile=src/main/resources/colorToproperties-1.1.2.jar -DgroupId=de.androidpit -DartifactId=colorToproperties -Dversion=1.1.2 -Dpackaging=jar -DgeneratePom=true 
```

- Ajouter la libraire en tant que dépendance dans votre projet Maven (`pom.xml`)

```
<dependencies>
    ...
    <dependency>
        <groupId>de.androidpit</groupId>
        <artifactId>colorToproperties</artifactId>
        <version>1.1.2</version>
    </dependency>
    ...
</dependencies>
```

- Utiliser la librairie comme suit:

```java
public static Map<String,Float> getPropertiesFromImg(String urlImg,Float valueToDispatch, int nb_of_colors, float randPart)
```

```java
/*
`String urlImg`: URL to the image ,
`Float valueToDispatch`: Volume of values to dispatch,
`int nb_of_colors`: Nbr of dominant color to extract
`Float randPart`: Random Part to dispatch  
 */
Map<String, Float> result = ImgToProperties.getPropertiesFromImg(url, 100f, 4,0.3f);
``` 

# Borra todas las imágenes sin etiqueta
docker image prune -a -f

# Borra todos los contenedores detenidos
docker container prune -f

# Borra todos los volúmenes no utilizados
docker volume prune -f

# Borra todas las imágenes, contenedores y volúmenes no utilizados
docker system prune -f

# Borra el caché de compilación de Docker
docker builder prune -f

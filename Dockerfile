FROM nginx
VOLUME /tmp
ENV LANG en_US.UTF-8
ENV TZ "Asia/Shanghai"
ADD ./dist /usr/share/nginx/html
ADD nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443

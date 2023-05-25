FROM nginx
ADD nginx.conf /etc/nginx/conf.d/default.conf
ADD docker-entrypoint.sh /docker-entrypoint.sh
RUN ls  && echo
COPY dist /usr/share/nginx/html
RUN ls /usr/share/nginx/html && echo

RUN chmod +x /docker-entrypoint.sh
CMD ["sh","/docker-entrypoint.sh"]
#ADD oauth2 /usr/share/nginx/html/oauth2

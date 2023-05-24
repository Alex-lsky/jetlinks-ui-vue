#node 构建
FROM node:18.16.0-buster-slim
WORKDIR /app
COPY . ./
RUN cnpm install
RUN npm run build

FROM nginx
WORKDIR /app
ADD nginx.conf /etc/nginx/conf.d/default.conf
ADD docker-entrypoint.sh /docker-entrypoint.sh
WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["sh","/docker-entrypoint.sh"]
#ADD oauth2 /usr/share/nginx/html/oauth2

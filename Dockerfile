FROM node:lts as porphyry-builder

COPY . /Porphyry
WORKDIR /Porphyry
RUN npm install
RUN npm run build

FROM nginx

COPY --from=porphyry-builder /Porphyry/build /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

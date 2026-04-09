# مرحلة البناء
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

# مرحلة التشغيل
FROM node:20-alpine
WORKDIR /app

# نسخ فقط الملفات الضرورية للتنفيذ
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# تنظيف الملفات غير الضرورية
RUN rm -rf /app/node_modules/.cache

EXPOSE 8000
CMD ["npm", "run", "start"]

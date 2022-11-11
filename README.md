```git clone https://github.com/hikinine/clean-start```

```cd clean-start```

```yarn install```

```cd scripts```

```docker compose up -d```

```cd ../```

```mv .env.test .env```

```yarn prisma db push```

```yarn prisma db seed```

```yarn dev```
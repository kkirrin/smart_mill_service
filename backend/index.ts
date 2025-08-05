import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import { DataSource, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, FindManyOptions } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config();

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    article!: string;

    @Column()
    name!: string;

    @Column("int")
    price!: number;

    @Column("int")
    quantity!: number;

    @CreateDateColumn()
    createdAt!: Date;
}

const main = async () => {
    const app = express();
    app.use(express.json());
    app.use(cors({ origin: process.env.FRONTEND_URL }));

    const AppDataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST || '',
        port: parseInt(process.env.DB_PORT || ''),
        username: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || '',
        entities: [Product],
        synchronize: false,
        migrationsRun: true,
        logging: true,
    });

    await AppDataSource.initialize();
    const productRepo = AppDataSource.getRepository(Product);

    app.get("/products", async (req, res) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const options: FindManyOptions<Product> = {
                order: { id: "ASC" },
                skip: (page - 1) * limit,
                take: limit,
            };

            const [data, total] = await productRepo.findAndCount(options);
            res.json({ data, total });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    });

    app.get("/products/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const product = await productRepo.findOne({ where: { id: parseInt(id) } });
            
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            
            res.json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    });

    app.post("/products", async (req, res) => {
        try {
            const { article, name, price, quantity } = req.body;

            if (!article || !name || !price || price <= 0 || quantity < 0) {
                return res.status(400).json({ message: "Invalid data" });
            }

            const newProduct = productRepo.create(req.body);
            await productRepo.save(newProduct);
            res.status(201).json(newProduct);
        } catch (error: any) {

            if (error.code === '23505') {
                return res.status(400).json({ message: "Article already exists" });
            }
            res.status(500).json({ message: "Server error" });
        }
    });

    app.put("/products/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { article, name, price, quantity } = req.body;

            // Проверяем существование товара
            const existingProduct = await productRepo.findOne({ where: { id: parseInt(id) } });
            if (!existingProduct) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Валидация данных
            if (!article || !name || !price || price <= 0 || quantity < 0) {
                return res.status(400).json({ message: "Invalid data" });
            }

            // Проверяем, не занят ли артикул другим товаром
            const productWithSameArticle = await productRepo.findOne({ 
                where: { article, id: parseInt(id) } 
            });
            
            if (!productWithSameArticle) {
                const articleExists = await productRepo.findOne({ 
                    where: { article } 
                });
                if (articleExists) {
                    return res.status(400).json({ message: "Article already exists" });
                }
            }

            // Обновляем товар
            await productRepo.update(id, {
                article,
                name,
                price,
                quantity
            });

            // Возвращаем обновленный товар
            const updatedProduct = await productRepo.findOne({ where: { id: parseInt(id) } });
            res.json(updatedProduct);
        } catch (error: any) {
            console.error(error);
            if (error.code === '23505') {
                return res.status(400).json({ message: "Article already exists" });
            }
            res.status(500).json({ message: "Server error" });
        }
    })

    app.delete("/products/:id", async (req, res) => {
        try {
            const result = await productRepo.delete(req.params.id);
            if (result.affected === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(204).send(); 
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    });

    app.listen(4000, () => {
        console.log("Backend server started on http://localhost:4000");
    });
};

main().catch(err => console.error(err));
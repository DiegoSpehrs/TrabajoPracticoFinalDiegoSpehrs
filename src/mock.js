import { faker } from "@faker-js/faker";

export const generateProducts = () => {
    const mokProducts = {
        prodId: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        thumbnail: faker.image.url(),
        code: faker.commerce.isbn(),
        stock: faker.number.int({ min: 10, max: 50 }),
        quantity: 0,
        category: faker.commerce.department()
    };
    return mokProducts;
}

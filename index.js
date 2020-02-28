const faker = require('faker');

console.log('name', faker.name.firstName());
console.log('name', faker.name.findName());
console.log('name', faker.fake("{{name.lastName}}, {{name.firstName}} {{address.streetName}}"));
console.log('name', faker.lorem.paragraphs());
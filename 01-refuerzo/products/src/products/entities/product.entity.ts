interface UpdateWithOptions {
  name?: string;
  description?: string;
  price?: number;
}
export class Product {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
  ) {}

  // TODO: updatewith

  updateWith({ name, description, price }: UpdateWithOptions) {
    this.name = name ?? this.name;
    this.description = description ?? this.description;
    this.price = price ?? this.price;
  }
}

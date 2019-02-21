export class Person {
  constructor(name, role) {
    this.name = name
    this.role = role
    this.won = -1
  }
}

export class Prize {
  constructor(item, name, image, eligible, wonBy) {
    this.name = name
    this.image = image
    this.eligible = eligible
    this.wonBy = wonBy
  }
}

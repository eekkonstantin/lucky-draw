export class Person {
  constructor(name, role) {
    this.name = name
    this.role = role
  }
}

export class Prize {
  constructor(item, prizeNo) {
    this.item = item
    this.prizeNo = prizeNo
    this.wonBy = null
  }
}

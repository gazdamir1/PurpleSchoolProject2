import { DivComponent } from "../../common/div-component"
import "./pagination.css"

export class Pagination extends DivComponent {
  constructor(state) {
    super()
    this.state = state
  }

  loadNextData() {
    this.state.offset += 9
  }

  loadPrevData() {
    this.state.offset -= 9
  }

  render() {
    this.el.classList.add("pagination")
    this.el.innerHTML = `
        <button class="prev__page" ${this.state.offset == 0 ? "disabled" : ""}>
            Предыдущая страница
        </button>
        <button class="next__page" ${
          this.state.offset + 9 >= this.state.numFound ? "disabled" : ""
        }>
            Следующая страница
        </button>`
    this.el
      .querySelector(".next__page")
      .addEventListener("click", this.loadNextData.bind(this))
    this.el
      .querySelector(".prev__page")
      .addEventListener("click", this.loadPrevData.bind(this))

    return this.el
  }
}

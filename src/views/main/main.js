import { AbstractView } from "../../common/view"
import onChange from "on-change"
import { Header } from "../../components/header/header"
import { Search } from "../../components/search/search"
import { cardList } from "../../components/card-list/card-list"
import { Pagination } from "../../components/pagination/pagination"

export class MainView extends AbstractView {
  state = {
    list: [],
    numFound: 0,
    loading: false,
    searchQuery: undefined,
    offset: 0,
    limit: 9,
  }

  constructor(appState) {
    super()
    this.appState = appState
    this.appState = onChange(this.appState, this.appStateHook.bind(this))
    this.state = onChange(this.state, this.stateHook.bind(this))
    this.setTitle("Поиск книг")
  }

  destroy() {
    onChange.unsubscribe(this.appState)
    onChange.unsubscribe(this.state)
  }

  appStateHook(path) {
    if (path === "favorites") {
      this.render()
    }
  }

  async stateHook(path) {
    if (path === "searchQuery") {
      this.state.loading = true
      const data = await this.loadList(
        this.state.searchQuery,
        (this.state.offset = 0),
        this.state.limit
      )
      this.state.loading = false
      this.state.numFound = data.numFound
      this.state.list = data.docs
    }
    if (path === "list" || path === "loading") {
      this.render()
    }
    if (path === "offset") {
      this.state.loading = true
      const data = await this.loadList(
        this.state.searchQuery,
        this.state.offset,
        this.state.limit
      )
      this.state.loading = false
      this.state.numFound = data.numFound
      this.state.list = data.docs
    }
  }

  async loadList(q, offset, limit) {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${q}&offset=${offset}&limit=${limit}`
    )
    return res.json()
  }

  render() {
    const main = document.createElement("div")
    main.innerHTML = `
        <h1>
            Найдено книг - ${this.state.numFound} книг
        </h1>
      `
    main.append(new Search(this.state).render())
    main.append(new cardList(this.appState, this.state).render())
    main.append(new Pagination(this.state).render())
    this.app.innerHTML = ""
    this.app.append(main)
    this.renderHeader()
  }
  renderHeader() {
    const header = new Header(this.appState).render()
    this.app.prepend(header)
  }
}

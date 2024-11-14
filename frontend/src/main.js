import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

// Your existing code

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
import 'tailwindcss/tailwind.css'

import route from 'ziggy-js';

const response = await fetch('/api/ziggy');
const Ziggy = await response.toJson();


const App = ({ Component, pageProps }) => <Component {...pageProps} />

export default App

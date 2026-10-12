/* Original 16 × 16 drawings, scaled without smoothing. */
window.Y2K = { icons: {} };
(() => {
 const shapes = {
 messenger:'<path fill="#202020" d="M1 2h12v8H7l-3 3v-3H1zM5 7h10v7h-3v2l-3-2H5z"/><path fill="#ffda32" d="M2 3h10v6H6l-1 2V9H2z"/><path fill="#fafafa" d="M6 8h8v5h-3v1l-2-1H6z"/><path fill="#204080" d="M3 5h7v1H3zM7 10h5v1H7z"/>',
 computer:'<path fill="#333" d="M2 1h12v10H2z"/><path fill="#c0c0c0" d="M3 2h10v8H3zM6 11h4v2H6zM1 13h14v2H1z"/><path fill="#008080" d="M4 3h8v6H4z"/><path fill="#fff" d="M4 3h1v5H4zM2 13h11v1H2z"/>',
 notepad:'<path fill="#333" d="M3 1h11v14H3z"/><path fill="#fff" d="M4 2h9v12H4z"/><path fill="#000080" d="M2 2h2v2H2zM2 6h2v2H2zM2 10h2v2H2z"/><path stroke="#808080" d="M6 5h5M6 7h5M6 9h5M6 11h3"/>',
 control:'<path fill="#333" d="M1 2h14v12H1z"/><path fill="#c0c0c0" d="M2 3h12v10H2z"/><path fill="#000080" d="M2 3h12v2H2z"/><path fill="#808080" d="M4 6h2v6H4zM8 6h2v6H8zM12 6h1v6h-1z"/><path fill="#fff" d="M3 7h4v2H3zM7 10h4v2H7zM11 7h3v2h-3z"/>',
 about:'<path fill="#000080" d="M4 1h8v1h2v2h1v8h-1v2h-2v1H4v-1H2v-2H1V4h1V2h2z"/><path fill="#fff" d="M7 3h2v2H7zM7 7h2v5h1v1H6v-1h1z"/>',
 folder:'<path fill="#805000" d="M1 3h6l2 2h6v9H1z"/><path fill="#ffff80" d="M2 4h4l2 2h6v7H2z"/><path fill="#d0a000" d="M2 7h13l-2 7H1z"/><path fill="#ffff80" d="M2 7h13v1H2z"/>',
 drive:'<path fill="#333" d="M1 6h14v7H1z"/><path fill="#c0c0c0" d="M3 3h10l2 4H1zM2 8h12v4H2z"/><path fill="#fff" d="M3 3h10v1H3zM2 8h12v1H2z"/><path fill="#008000" d="M11 10h2v1h-2z"/>',
 floppy:'<path fill="#333" d="M2 1h11l2 2v12H2z"/><path fill="#000080" d="M3 2h10l1 2v10H3z"/><path fill="#c0c0c0" d="M5 2h6v5H5zM5 10h7v4H5z"/><path fill="#333" d="M8 2h2v4H8z"/><path fill="#fff" d="M6 11h5v2H6z"/>',
 cd:'<path fill="#333" d="M4 1h8v1h2v2h1v8h-1v2h-2v1H4v-1H2v-2H1V4h1V2h2z"/><path fill="#c0c0c0" d="M4 2h8v1h2v2h1v6h-1v2h-2v1H4v-1H2v-2H1V5h1V3h2z"/><path fill="#fff" d="M4 3h5L5 7H3zM9 9h4v3h-2z"/><path fill="#008080" d="M7 6h3v4H6V7h1z"/><path fill="#333" d="M7 7h2v2H7z"/>',
 file:'<path fill="#333" d="M3 1h7l3 3v11H3z"/><path fill="#fff" d="M4 2h5v3h3v9H4z"/><path stroke="#808080" d="M5 7h5M5 9h5M5 11h4"/>'
 };
 Y2K.icon = (name, small=false) => `<svg class="icon${small?' small':''}" viewBox="0 0 16 16" aria-hidden="true" shape-rendering="crispEdges">${shapes[name]||shapes.file}</svg>`;
})();

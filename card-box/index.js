// Create a class for the element
class CardBox extends HTMLElement
{

  static get observedAttributes() {return ['src', 'title', 'description']; }

  constructor()
  {
    // Always call super first in constructor
    super();
    
    // Create a shadow root
    var shadow = this.attachShadow({mode: 'open'});

    var imgHeight = 64;
    var title = this.getAttribute('title') || '{untitled}';
    var description = this.getAttribute('description') || '{undescribed}';
    var src = (this.hasAttribute('src') ? this.getAttribute('src') : null) || 
        placeholderImg();
    
    var html = `<div class="wrapper">
    <h3>${title}</h3>
      <div class="placeholder">
        <div class="tb">
          <div class="td">
            <img src="${src}" alt="${title}" tabindex="-1">
          </div>
        </div>
      </div>
      <p>${description}</p>
    </div>`;

    var style = document.createElement('style');
    style.textContent = `.wrapper {
      padding: 10px;
      text-align: center;
      cursor: pointer;
    }
    .wrapper .placeholder {
      display: inline-block;
    }
    .wrapper .tb {
      display: table;
      margin: 0 auto;
      transition: all .5s ease-in-out;
      background-color: rgba(0, 0, 0, 0);
    }
    .wrapper .td {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      height: ${imgHeight}px;
    }
    .wrapper img {
      max-height: ${imgHeight}px;
      width: auto;
      outline: none;
      border: none;
      transition: all 1s ease-in-out;
    }
    .card-boxed.wrapper .tb {
      position: fixed;
      top: 0; left: 0;
      right: 0; bottom: 0;
      width: 100%; height: 100%;
      background-color: rgba(0, 0, 0, .5);
      z-index: 9999;
    }
    .card-boxed.wrapper img {
      max-height: none;
    }`;

    shadow.appendChild(style);

    shadow.innerHTML += html;
    this.events = {};
    this.wrapper = shadow.querySelector('.wrapper');

    applyOutterStyles(document);
  }
  attributeChangedCallback(name, oldValue, newValue)
  {
    switch(name)
    {
      case 'title':
        setText(this.wrapper.querySelector('h3'), newValue);
        this.wrapper.querySelector('img').setAttribute(name, newValue);
        break;
      case 'description':
        setText(this.wrapper.querySelector('p'), newValue);
        break;
      case 'src':
        this.wrapper.querySelector('img').setAttribute(name, newValue);
        break;
    }
  }
  connectedCallback()
  {
    bindEvents(this.events, this.wrapper);
  }
  disconnectedCallback()
  {
    unbindEvents(this.events, this.wrapper);
  }
}

function setText(element, text)
{
  if (element)
  {
    while (element.firstChild)
    {
      element.removeChild(element.firstChild);
    }
  }

  if (text)
  {
    element.appendChild(element.ownerDocument.createTextNode(text));
  }
}

function bindEvents(events, wrapper)
{
  if (!events.onclick)
  {
    
    events.onclick = function cbClickHandler()
    {

      var ph = wrapper.querySelector('.placeholder');
      var dim = ph.getBoundingClientRect();
      var action = cbClickHandler.opened ? 'remove' : 'add';
      ph.style.width = cbClickHandler.opened ? '' : `${dim.width}px`;
      ph.style.height = cbClickHandler.opened ? '' : `${dim.height}px`;

      document.documentElement.classList[action]('card-boxed');
      wrapper.classList[action]('card-boxed');

      cbClickHandler.opened = !cbClickHandler.opened;

    };

    wrapper.addEventListener('click', events.onclick, false);

  }
}

function unbindEvents(events, wrapper)
{
  if (events.onclick)
  {
    
    wrapper.removeEventListener('click', events.onclick, false);

    events.onclick = null;

  }
}

function applyOutterStyles(dom)
{
  if (!applyOutterStyles.applied)
  {
    var style = dom.createElement('style');
    style.textContent = `html.card-boxed,
    html.card-boxed body {
      overflow: hidden!important;
      height: 100%!important;
    }`;
    dom.querySelector('head').appendChild(style);
    applyOutterStyles.applied = true;
  }
}

function placeholderImg()
{
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA'+
  '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'+
  'KqYlpp1gAAAABJRU5ErkJggg==';
}

// Define the new element
customElements.define('card-box', CardBox);

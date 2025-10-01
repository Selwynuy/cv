$('.navbar').on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});

// Simple scroll reveal using IntersectionObserver
(function(){
    var elements = [].slice.call(document.querySelectorAll('.reveal'));
    if(!('IntersectionObserver' in window)){
        // Fallback: just show them
        elements.forEach(function(el){ el.classList.add('in-view'); });
        return;
    }
    var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {rootMargin: '0px 0px -10% 0px', threshold: 0.1});

    elements.forEach(function(el){ observer.observe(el); });
})();

// Projects pagination (3x2 per page)
(function(){
    var container = document.querySelector('#projects');
    if(!container) return;

    var grid = container.querySelector('.projects-grid');
    if(!grid) return;

    var cards = [].slice.call(grid.querySelectorAll('.project-card-wrapper'));
    var perPage = 6; // fixed 3x2 grid per page
    var current = 1;
    var total = Math.max(1, Math.ceil(cards.length / perPage));

    var controls = container.querySelector('.pagination-controls');
    if(!controls){
        controls = document.createElement('div');
        controls.className = 'pagination-controls';
        container.appendChild(controls);
    }

    function render(){
        cards.forEach(function(card, i){
            var pageIndex = Math.floor(i / perPage) + 1;
            card.style.display = pageIndex === current ? '' : 'none';
        });
        drawControls();
    }

    // Always render 6 per page (3 columns x 2 rows)

    function drawControls(){
        controls.innerHTML = '';
        var prev = document.createElement('button');
        prev.textContent = 'Prev';
        prev.className = 'page-btn';
        prev.disabled = current === 1;
        prev.onclick = function(){ current = Math.max(1, current-1); render(); window.location.hash = '#projects'; };
        controls.appendChild(prev);

        for(var p=1;p<=total;p++){
            var btn = document.createElement('button');
            btn.textContent = p;
            btn.className = 'page-btn' + (p===current ? ' active' : '');
            (function(page){ btn.onclick = function(){ current = page; render(); window.location.hash = '#projects'; }; })(p);
            controls.appendChild(btn);
        }

        var next = document.createElement('button');
        next.textContent = 'Next';
        next.className = 'page-btn';
        next.disabled = current === total;
        next.onclick = function(){ current = Math.min(total, current+1); render(); window.location.hash = '#projects'; };
        controls.appendChild(next);
    }

    render();

})();

// Active nav link on scroll
(function(){
    var sections = ['about','work-experience','education','skills','projects','case-studies','contact','hobbies'];
    var links = sections.map(function(id){
        return { id: id, el: document.querySelector('a[href="#'+id+'"]') };
    });
    if(!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            var found = links.find(function(l){ return '#'+l.id === '#' + entry.target.id; });
            if(!found || !found.el) return;
            if(entry.isIntersecting){
                links.forEach(function(l){ if(l.el) l.el.classList.remove('active'); });
                found.el.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(function(id){ var el = document.getElementById(id); if(el) observer.observe(el); });
})();

// Contact form noop (prevent submission here)
(function(){
    var form = document.getElementById('contact-form');
    if(!form) return;
    form.addEventListener('submit', function(e){
        e.preventDefault();
        alert('Thanks! I\'ll get back to you shortly.');
    });
})();
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';

    // Style canvas to stay in background
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.background = '#f8fafc'; // Light clean background matching the CSS var

    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');

    let w, h;
    let floatingImages = [];

    // Config
    const mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Image URLs for the collage (Courses, Campus, Tech, Medical, Business)
    const imageUrls = [
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800', // University
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800', // Students
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800', // Tech
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800', // Medical
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800', // Business
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800', // Science
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'  // Collaboration
    ];

    const loadedImages = [];
    let imagesLoadedCount = 0;

    imageUrls.forEach(url => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
            imagesLoadedCount++;
            loadedImages.push(img);
            if (imagesLoadedCount === imageUrls.length) {
                initFloatingImages();
            }
        };
    });

    function initFloatingImages() {
        floatingImages = [];
        // Determine how many images to show based on screen size, 20 looks good densely populated
        const imgCount = 20;

        for (let i = 0; i < imgCount; i++) {
            const img = loadedImages[i % loadedImages.length];
            floatingImages.push(new FloatingImage(img, i));
        }
    }

    class FloatingImage {
        constructor(img, index) {
            this.img = img;
            // Larger size for a majestic feel
            this.width = Math.random() * 400 + 300;
            this.height = this.width * (img.height / img.width);

            // Distribute evenly
            this.x = Math.random() * (w + this.width) - this.width / 2;
            this.y = Math.random() * (h + this.height) - this.height / 2;

            // Extremely slow, graceful movement
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;

            // Gentle rotation
            this.rotation = Math.random() * Math.PI * 2;
            this.vRot = (Math.random() - 0.5) * 0.002;

            // More visible opacity for light mode
            this.opacity = Math.random() * 0.15 + 0.05;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.vRot;

            // Subtle Parallax Effect against mouse
            if (mouse.x && mouse.y) {
                const dx = mouse.x - w / 2;
                const dy = mouse.y - h / 2;
                this.x -= dx * 0.0003;
                this.y -= dy * 0.0003;
            }

            // Wrap around the screen borders when they go fully out of frame
            if (this.x > w + this.width / 2) this.x = -this.width / 2;
            else if (this.x < -this.width / 2) this.x = w + this.width / 2;

            if (this.y > h + this.height / 2) this.y = -this.height / 2;
            else if (this.y < -this.height / 2) this.y = h + this.height / 2;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            // Multiply blend mode works best on light backgrounds to overlay color smoothly
            ctx.globalCompositeOperation = 'multiply';

            // Give image rounded corners look by clipping
            ctx.beginPath();
            ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 20);
            ctx.clip();

            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);

            ctx.restore();
        }
    }

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;

        if (loadedImages.length === imageUrls.length) {
            initFloatingImages();
        }
    }

    window.addEventListener('resize', resize);

    function animate() {
        // Clear frame but let base background color stay
        ctx.clearRect(0, 0, w, h);

        // Draw the moving picture collage
        for (let img of floatingImages) {
            img.update();
            img.draw();
        }

        requestAnimationFrame(animate);
    }

    resize();
    animate();
});

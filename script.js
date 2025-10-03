  document.addEventListener('DOMContentLoaded', function () {
	const container = document.querySelector('.book-container');
	const categorySelect = document.querySelector('#categoria-filtro');
	const sortSelect = document.querySelector('#ordenar-por');

	function getCardData(card) {
		const title = card.querySelector('.book-title')?.textContent || '';
		const author = card.querySelector('.book-author')?.textContent || '';
		const category = card.querySelector('.book-category')?.textContent || '';
		const dateText = card.querySelector('.book-date')?.textContent || '';
		const ratingText = card.querySelector('.book-rating')?.textContent || '';

		const yearMatch = dateText.match(/\d{4}/);
		const ratingMatch = ratingText.match(/(\d+(\.\d+)?)/);
		const year = yearMatch ? parseInt(yearMatch[0], 10) : 0;
		const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
		return { title, author, category, year, rating };
	}

	let modal, modalContent;
	function ensureModal() {
		if (modal) return;
		modal = document.createElement('div');
		modal.setAttribute('role', 'dialog');
		modal.setAttribute('aria-modal', 'true');
		Object.assign(modal.style, {
			position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.5)', display: 'none',
			alignItems: 'center', justifyContent: 'center', zIndex: '9999'
		});
		modalContent = document.createElement('div');
		Object.assign(modalContent.style, {
			background: '#fff', maxWidth: '600px', width: '90%', borderRadius: '12px',
			padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative'
		});
		const closeBtn = document.createElement('button');
		closeBtn.setAttribute('aria-label', 'Fechar');
		closeBtn.textContent = '✕';
		Object.assign(closeBtn.style, {
			position: 'absolute', top: '10px', right: '10px', border: 'none',
			background: 'transparent', fontSize: '20px', cursor: 'pointer'
		});
		closeBtn.addEventListener('click', hideModal);
		modalContent.appendChild(closeBtn);
		modal.appendChild(modalContent);
		document.body.appendChild(modal);
		modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
		document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideModal(); });
	}
	function showModal(html) {
		ensureModal();
		modalContent.innerHTML = modalContent.firstChild.outerHTML + html;
		modal.style.display = 'flex';
		document.body.style.overflow = 'hidden';
	}
	function hideModal() {
		if (!modal) return;
		modal.style.display = 'none';
		document.body.style.overflow = '';
	}
document.addEventListener('click', function (e) {
		const btn = e.target.closest('.btn-details');
		if (!btn) return;
		const card = btn.closest('.book-card');
		if (!card) return;
		const { title, author, category, year } = getCardData(card);
		const desc = card.querySelector('.book-description')?.textContent || '';
		const status = card.querySelector('.book-status')?.textContent || '';
		const rating = card.querySelector('.book-rating')?.textContent || '';
		const html = `
			<h2 style="margin-top:0;">${title}</h2>
			<p><strong>Autor:</strong> ${author}</p>
			<p><strong>Categoria:</strong> ${category}</p>
			<p><strong>Ano:</strong> ${year || '—'}</p>
			<p><strong>Status:</strong> ${status}</p>
			<p><strong>Avaliação:</strong> ${rating}</p>
			<hr>
			<p>${desc}</p>
		`;
		showModal(html);
	});

	function applyFilterAndSort() {
		const selectedCategory = (categorySelect?.value || '').trim();
		const cards = Array.from(container.querySelectorAll('.book-card'));
		cards.forEach(card => {
			const { category } = getCardData(card);
			const match = !selectedCategory || category.includes(selectedCategory);
			card.style.display = match ? '' : 'none';
		});
		const visibleCards = cards.filter(c => c.style.display !== 'none');
		const sortBy = (sortSelect?.value || 'titulo');
		visibleCards.sort((a, b) => {
			const da = getCardData(a);
			const db = getCardData(b);
			if (sortBy === 'avaliacao') {
				return db.rating - da.rating; // maior primeiro
			}
			return da.title.localeCompare(db.title, 'pt', { sensitivity: 'base' }); // A–Z
		});
		visibleCards.forEach(card => container.appendChild(card));
	}
	categorySelect?.addEventListener('change', applyFilterAndSort);
	sortSelect?.addEventListener('change', applyFilterAndSort);
	applyFilterAndSort();
 });

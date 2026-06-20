const pageLoader = document.getElementById('pageLoader');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const backToTop = document.querySelector('.back-to-top');
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
const faqList = document.getElementById('faqList');
const roiForm = document.getElementById('roiForm');
const contactForm = document.getElementById('contactForm');
const contactFeedback = document.getElementById('contactFeedback');
const links = document.querySelectorAll('a[href^="#"]');

let currentTestimonial = 0;
let testimonialInterval;

window.addEventListener('load', () => {
  pageLoader.style.display = 'none';
  startTestimonialAutoPlay();
});

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 20;
  navbar.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('visible', window.scrollY > 500);
  setActiveSection();
});

links.forEach(link => {
  if (!link.hash || link.href.includes('mailto:') || link.href.includes('tel:')) return;
  link.addEventListener('click', event => {
    const target = document.querySelector(link.hash);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

navToggle.addEventListener('click', () => {
  const expanded = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', expanded);
});

function setActiveSection() {
  const sections = document.querySelectorAll('main section[id]');
  let activeId = 'home';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom > 120) {
      activeId = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
  });
}

function showTestimonial(index) {
  currentTestimonial = (index + testimonialCards.length) % testimonialCards.length;
  testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
}

function startTestimonialAutoPlay() {
  testimonialInterval = setInterval(() => {
    showTestimonial(currentTestimonial + 1);
  }, 6000);
}

function resetTestimonialAutoPlay() {
  clearInterval(testimonialInterval);
  startTestimonialAutoPlay();
}

testimonialPrev.addEventListener('click', () => {
  showTestimonial(currentTestimonial - 1);
  resetTestimonialAutoPlay();
});

testimonialNext.addEventListener('click', () => {
  showTestimonial(currentTestimonial + 1);
  resetTestimonialAutoPlay();
});

faqList.addEventListener('click', event => {
  const button = event.target.closest('.faq-question');
  if (!button) return;
  const item = button.closest('.faq-item');
  const isOpen = item.classList.toggle('open');
  button.setAttribute('aria-expanded', isOpen);
  faqList.querySelectorAll('.faq-item').forEach(other => {
    if (other !== item) {
      other.classList.remove('open');
      other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    }
  });
});

function formatCurrency(value) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

if (roiForm) {
  const adSpend = document.getElementById('adSpend');
  const customerValue = document.getElementById('customerValue');
  const currentLeads = document.getElementById('currentLeads');
  const conversionRate = document.getElementById('conversionRate');
  const estimatedRevenue = document.getElementById('estimatedRevenue');
  const costPerLead = document.getElementById('costPerLead');
  const projectedProfit = document.getElementById('projectedProfit');
  const roiPercent = document.getElementById('roiPercent');
  const revenueProgress = document.getElementById('revenueProgress');
  const conversionProgress = document.getElementById('conversionProgress');

  const calculate = () => {
    const spend = Number(adSpend.value) || 0;
    const value = Number(customerValue.value) || 0;
    const leads = Number(currentLeads.value) || 0;
    const conversion = clamp(Number(conversionRate.value) || 0, 0, 100) / 100;

    const revenue = Math.round(leads * conversion * value);
    const profit = Math.round(revenue - spend);
    const cpl = leads > 0 ? Math.round(spend / leads) : 0;
    const roi = spend > 0 ? Math.round((profit / spend) * 100) : 0;

    estimatedRevenue.textContent = formatCurrency(revenue);
    costPerLead.textContent = formatCurrency(cpl);
    projectedProfit.textContent = formatCurrency(profit >= 0 ? profit : 0);
    roiPercent.textContent = `${roi >= 0 ? roi : 0}%`;

    revenueProgress.style.width = `${clamp((revenue / Math.max(1, spend)) * 20, 10, 100)}%`;
    conversionProgress.style.width = `${clamp(conversion * 100, 10, 100)}%`;
  };

  document.getElementById('calculateBtn').addEventListener('click', () => {
    if (!roiForm.checkValidity()) {
      roiForm.reportValidity();
      return;
    }
    calculate();
  });

  [adSpend, customerValue, currentLeads, conversionRate].forEach(input => {
    input.addEventListener('input', calculate);
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      contactFeedback.textContent = 'Please complete all fields before submitting.';
      contactFeedback.style.color = '#f17d5c';
      return;
    }
    contactFeedback.style.color = '#d7a86d';
    contactFeedback.textContent = 'Thanks! Your message has been received. I will follow up within 24 hours.';
    contactForm.reset();
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'none';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('section, .service-card, .case-card, .testimonial-card, .process-step, .contact-card, .result-card, .faq-item').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(24px)';
  section.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
  observer.observe(section);
});

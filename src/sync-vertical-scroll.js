let ticking = false;
let scrollPercent = null;

const syncVerticalScroll = elements => {
  const handleScroll = ({ target }) => {
    scrollPercent =
      target.scrollTop / (target.scrollHeight - target.offsetHeight);

    if (ticking) return;

    ticking = true;

    // Throttle DOM updates for performance
    // Source: https://www.html5rocks.com/en/tutorials/speed/animations/
    window.requestAnimationFrame(() => {
      const otherElements = elements.filter(el => el !== target);

      // Remove scroll listener of otherElements before changing their scrollTop
      // so that we don't trigger scroll listener of target
      otherElements.forEach(el => {
        el.removeEventListener('scroll', handleScroll);

        el.scrollTop = Math.round(
          scrollPercent * (el.scrollHeight - el.offsetHeight)
        );
      });

      // Wait for other.scrollTop to settle before restoring scroll listener of
      // otherElements
      window.requestAnimationFrame(() => {
        otherElements.forEach(el =>
          el.addEventListener('scroll', handleScroll)
        );
      });

      ticking = false;
    });
  };

  elements.forEach(el => el.addEventListener('scroll', handleScroll));
};

module.exports = syncVerticalScroll;

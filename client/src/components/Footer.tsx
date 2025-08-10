export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <p className='copyright-text'>Scrum Board &copy; {currentYear} - {currentYear}</p>
      <p className='footer-made-by-text'>Made by -
        <a href="https://github.com/Arrowstormen" target="_blank" rel="noopener noreferrer" title="GitHub profile link will open on a new tab">
          <strong>
            Mikkel Østergaard
          </strong>
        </a>
        &
        <a href="https://github.com/NishaVijai" target="_blank" rel="noopener noreferrer" title="GitHub profile link will open on a new tab">
          <strong>
            Nisha Vijai
          </strong>
        </a>
      </p>
    </footer>
  );
};

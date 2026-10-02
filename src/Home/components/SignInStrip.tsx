import { useSelector } from 'react-redux';

import { selectIsAuthenticated } from '../../redux-store/Slices/authSlice';
import { HeartIcon } from './Icons';

export function SignInStrip() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) return null;

  return (
    <section className="lm-signin" aria-labelledby="lm-signin-title">
      <span className="lm-signin__mark">
        <HeartIcon />
      </span>
      <div className="lm-signin__text">
        <p className="lm-signin__title" id="lm-signin-title">
          Keep your local finds together.
        </p>
        <p className="lm-signin__sub">
          Sign in to see saved items, your diet lists, ration schedule and
          wallet.
        </p>
      </div>
      <a className="lm-btn lm-btn--primary lm-signin__cta" href="/signin">
        Sign in
      </a>
    </section>
  );
}

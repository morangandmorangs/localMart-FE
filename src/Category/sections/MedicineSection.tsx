import { Link } from "react-router-dom";

import { GET_APP_PATH } from "../../config/apps";
import { AlertIcon, UploadIcon } from "../../Home/components/Icons";
import { Tag } from "../../Home/components/Tag";
import { ProductShelf } from "../components/ProductShelf";

/**
 * Medicine has two routes, and they are kept visibly apart: prescriptions
 * start at the upload panel so a pharmacist sees them first, and only the
 * over-the-counter shelf below is ordered outright. Both happen in the
 * Local Mart app.
 */
export function MedicineSection() {
  return (
    <>
      <section className='lm-catpage__section' aria-labelledby='lm-rx-title'>
        <div className='lm-rx-panel'>
          <div className='lm-rx-panel__head'>
            <h2 className='lm-rx-panel__title' id='lm-rx-title'>
              Prescription medicines
            </h2>
            <Tag tone='rx'>RX</Tag>
          </div>

          <p className='lm-rx-panel__text'>
            Upload a photo of your prescription in the Local Mart app. A
            licensed pharmacist checks it before anything is dispensed, and
            will call you if a substitution is needed.
          </p>

          <Link className='lm-btn lm-btn--primary' to={GET_APP_PATH}>
            <UploadIcon className='lm-btn__icon' />
            Upload prescription in the app
          </Link>

          <p className='lm-rx-panel__note'>
            <AlertIcon className='lm-rx-panel__note-icon' />
            <span>
              Prescription items are only dispensed after a pharmacist checks
              them, and no substitution is made without your consent.
            </span>
          </p>
        </div>
      </section>

      <section className='lm-catpage__section' aria-labelledby='lm-otc-title'>
        <div className='lm-catpage__subhead'>
          <h2 className='lm-catpage__subtitle' id='lm-otc-title'>
            Over-the-counter
          </h2>
          <p className='lm-catpage__subnote'>No prescription needed here.</p>
        </div>

        <ProductShelf query={{ category: "medicine" }} noun='over-the-counter medicine' />
      </section>
    </>
  );
}

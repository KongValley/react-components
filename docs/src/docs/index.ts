import { generalDocs } from './general';
import { layoutDocs } from './layout';
import { dataEntryDocs } from './data-entry';
import { dataDisplayDocs } from './data-display';
import { feedbackDocs } from './feedback';
import { navigationDocs } from './navigation';
import { multiDeviceDocs } from './multi-device';
import { mobileDocs } from './mobile';
import type { ComponentDoc } from './types';

export const DOCS: ComponentDoc[] = [
  ...generalDocs,
  ...layoutDocs,
  ...dataEntryDocs,
  ...dataDisplayDocs,
  ...feedbackDocs,
  ...navigationDocs,
  ...multiDeviceDocs,
  ...mobileDocs,
];

export const DOC_MAP = new Map(DOCS.map((doc) => [doc.key, doc]));

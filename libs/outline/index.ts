import createClient from 'openapi-fetch';
import { paths } from './schema'; // generated by openapi-typescript

export const createOutlineClient = createClient<paths>;

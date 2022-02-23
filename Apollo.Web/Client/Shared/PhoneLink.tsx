import * as React from 'react';
import {Link} from "@material-ui/core";
export const PhoneLink = (props: { phone: string }) => <Link href={`tel:${props.phone}`}>{props.phone}</Link>;

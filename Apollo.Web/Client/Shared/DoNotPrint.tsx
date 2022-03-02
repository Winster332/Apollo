import { TableCell, TableFooter } from '@material-ui/core';
import styled from 'styled-components';

export const DoNotPrint = styled('div')`
    @media print and (min-width: 480px) {
        display: none;
    }
`;

export const TableFooterDoNotPrint = styled(TableFooter)`
    @media print and (min-width: 480px) {
        display: none;
    }
`;

export const TableCellDoNotPrint = styled(TableCell)`
    @media print and (min-width: 480px) {
        display: none;
    }
`;

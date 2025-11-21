import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import type { Components } from "react-markdown";

const markdownComponents: Components = {
    p: ({ ...props }) => <Typography component="div" variant="body2" sx={{ lineHeight: 1.6, mb: 1 }} {...props} />,
    h1: ({ ...props }) => <Typography component="h1" variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 1 }} {...props} />,
    h2: ({ ...props }) => <Typography component="h2" variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }} {...props} />,
    h3: ({ ...props }) => <Typography component="h3" variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }} {...props} />,
    ul: ({ ...props }) => <Box component="ul" sx={{ pl: 2, my: 1 }} {...props} />,
    ol: ({ ...props }) => <Box component="ol" sx={{ pl: 2, my: 1 }} {...props} />,
    li: ({ ...props }) => <Typography component="li" variant="body2" sx={{ mb: 0.5 }} {...props} />,
    code: ({ inline, ...props }) =>
        inline ? (
            <Box
                component="code"
                sx={{
                    bgcolor: "grey.100",
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 0.75,
                    fontFamily: "monospace",
                    fontSize: "0.85em",
                    color: "text.primary",
                }}
                {...props}
            />
        ) : (
            <Box
                component="pre"
                sx={{
                    bgcolor: "grey.100",
                    p: 1.5,
                    borderRadius: 1,
                    overflow: "auto",
                    fontSize: "0.85em",
                    my: 1,
                    fontFamily: "monospace",
                }}
                {...props}
            />
        ),
    blockquote: ({ ...props }) => (
        <Box
            component="blockquote"
            sx={{
                borderLeft: "4px solid",
                borderColor: "primary.main",
                pl: 2,
                ml: 0,
                my: 1.5,
                py: 0.5,
                fontStyle: "italic",
                bgcolor: "grey.50",
                borderRadius: "0 4px 4px 0",
            }}
            {...props}
        />
    ),
    
    // Enhanced Table components with hover effects
    table: ({ ...props }) => (
        <TableContainer 
            component={Paper} 
            sx={{ 
                my: 2,
                boxShadow: 2,
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                    boxShadow: 4,
                },
                transition: 'box-shadow 0.2s ease-in-out',
            }}
        >
            <Table 
                size="small" 
                sx={{
                    '& .MuiTableCell-root': {
                        transition: 'background-color 0.2s ease-in-out',
                    }
                }}
                {...props} 
            />
        </TableContainer>
    ),
    thead: ({ ...props }) => (
        <TableHead 
            sx={{ 
                bgcolor: 'primary.main',
                '& .MuiTableCell-root': {
                    borderBottom: 'none',
                }
            }} 
            {...props} 
        />
    ),
    tbody: ({ ...props }) => (
        <TableBody 
            sx={{
                '& .MuiTableRow-root:hover': {
                    bgcolor: 'action.hover',
                    '& .MuiTableCell-root': {
                        bgcolor: 'action.hover',
                    }
                }
            }} 
            {...props} 
        />
    ),
    tr: ({ ...props }) => (
        <TableRow 
            sx={{
                '&:last-child .MuiTableCell-root': {
                    borderBottom: 'none',
                }
            }}
            {...props} 
        />
    ),
    th: ({ align, ...props }) => (
        <TableCell
            component="th"
            align={align as 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined}
            sx={{
                fontWeight: 'bold',
                color: 'white',
                fontSize: '0.875rem',
                py: 1.5,
                px: 2,
            }}
            {...props}
        />
    ),
    td: ({ align, ...props }) => (
        <TableCell
            align={align as 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined}
            sx={{
                borderBottom: '1px solid',
                borderColor: 'grey.200',
                fontSize: '0.875rem',
                py: 1.5,
                px: 2,
                '&:first-of-type': {
                    borderLeft: 'none',
                },
                '&:last-of-type': {
                    borderRight: 'none',
                },
            }}
            {...props}
        />
    ),
};

export default markdownComponents;
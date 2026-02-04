# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a legacy **Visual Basic 6** business application for "Herrajes H. Yrigoyen 825 S.A.", a locksmith/hardware store. The application was developed in 2008 and handles:
- Customer management (Clientes)
- Product/article inventory (Articulos)
- Invoicing and receipts (Remitos/Facturas)
- Collections/payments (Cobranzas)
- Price calculations and updates

## Technology Stack

- **Language**: Visual Basic 6 (VB6)
- **Database**: Microsoft Access (HY.mdb) via DAO 3.6
- **Reporting**: Crystal Reports (Seagate Crystal Reports)
- **UI Components**: MSComCtl, MSComCt2, DBGrid32, MSADODC, MSDATGRD, Comdlg32

## Architecture

### Entry Point
- `cerrajeria.frm` - Main menu form, opens the database on Form_Load
- Startup executable: `H Yrigoyen825.exe`

### Database Connection
The database is opened globally in `Module1.bas`:
```vb
Public miBase As Database
' Opened as: OpenDatabase(App.Path & "\HY.mdb", False, False)
```

### Global State (Module1.bas)
Key global variables used across forms:
- `miBase` - Database connection
- `rClientes`, `rArt`, `rFacturas`, `rCobranza` - Main recordsets
- `flag` - Operation mode flag (1=Add, 2=Modify)
- `vcodcli`, `vrazon`, `vlista` - Current client context
- `vSubtotal`, `vIva21`, `vIva105`, `vtotal`, `vBonif` - Invoice calculations

### Utility Functions (Module1.bas)
- `ElegirTipoIVA(valor)` - Converts IVA type codes to display names
- `LETRAS(numero)` - Converts numbers to Spanish text (for invoice amounts)
- `strzero(valor, ancho)` - Zero-pads strings to specified width

### Form Naming Convention
- `frm*` - Standard data entry/management forms
- Forms use a consistent CRUD pattern with buttons: Agregar (Add), Modificar (Edit), Eliminar (Delete), Buscar (Search)

### Main Forms
| Form | Purpose |
|------|---------|
| cerrajeria | Main menu - entry point |
| fabrica | Articles/products management |
| frmclientes | Customer management |
| frmremito | Receipts/delivery notes |
| frmcobranza | Payment collections |
| frmcuentas | Account management |
| frmlistado | Reports listing |
| frmactualizar | Price updates |
| frmcalculoprecio | Price calculator |

### Reports (.rpt files)
Crystal Reports templates for printing:
- `Articulos.rpt`, `ArticulosG.rpt`, `ArticulosP.rpt` - Product listings
- `Remito.rpt`, `Remitos2.rpt` - Delivery notes
- `factura crystal.rpt` - Invoice

## Development Environment

**Required**: Visual Basic 6.0 IDE with the following references/components:
- Microsoft DAO 3.6 Object Library
- Seagate Crystal Reports (Crystl32.OCX)
- DBGRID32.OCX, MSCOMCTL.OCX, MSCOMCT2.OCX
- MSADODC.OCX, MSDATGRD.OCX, Comdlg32.ocx
- Microsoft Data Formatting Object Library 6.0

To open the project: Load `Proyecto1.vbp` in VB6 IDE.

## Common Patterns

### Form Operation Flag
Forms use a global `flag` variable to track operation mode:
- `flag = 1` → Adding new record
- `flag = 2` → Modifying existing record

### Record Navigation
Forms typically include navigation buttons (cmddesplazar array) for First/Previous/Next/Last record movement.

### Data Binding Pattern
Forms follow a manual binding pattern:
1. `iniciar()` - Clears all form fields
2. `cargar()` - Loads current recordset data into form controls
3. `reemplazar()` - Saves form control values back to recordset

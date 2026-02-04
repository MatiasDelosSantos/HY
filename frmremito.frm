VERSION 5.00
Object = "{00025600-0000-0000-C000-000000000046}#5.2#0"; "Crystl32.OCX"
Object = "{00028C01-0000-0000-0000-000000000046}#1.0#0"; "DBGRID32.OCX"
Begin VB.Form frmremito 
   BackColor       =   &H8000000E&
   Caption         =   "REMITO"
   ClientHeight    =   10290
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   11685
   LinkTopic       =   "Form1"
   ScaleHeight     =   10290
   ScaleWidth      =   11685
   StartUpPosition =   2  'CenterScreen
   Begin VB.CommandButton cmdimprimir 
      Caption         =   "imprimir y guardar"
      Height          =   735
      Left            =   2520
      Picture         =   "frmremito.frx":0000
      Style           =   1  'Graphical
      TabIndex        =   1
      Top             =   8880
      Width           =   1455
   End
   Begin VB.CommandButton cmdcancelar 
      Caption         =   "cancelar"
      Height          =   735
      Left            =   4680
      Picture         =   "frmremito.frx":2982
      Style           =   1  'Graphical
      TabIndex        =   2
      Top             =   8880
      Width           =   975
   End
   Begin VB.Data Data1 
      Caption         =   "Data1"
      Connect         =   "Access 2000;"
      DatabaseName    =   ""
      DefaultCursorType=   0  'DefaultCursor
      DefaultType     =   2  'UseODBC
      Exclusive       =   0   'False
      Height          =   345
      Left            =   0
      Options         =   0
      ReadOnly        =   0   'False
      RecordsetType   =   1  'Dynaset
      RecordSource    =   ""
      Top             =   9640
      Visible         =   0   'False
      Width           =   2175
   End
   Begin VB.CommandButton cmdborrarboton 
      Caption         =   "Borrar ringlon"
      Height          =   375
      Left            =   120
      TabIndex        =   3
      Top             =   8520
      Width           =   1695
   End
   Begin Crystal.CrystalReport informe1 
      Left            =   0
      Top             =   10080
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   348160
      ReportFileName  =   "factura"
      Destination     =   1
      WindowControlBox=   -1  'True
      WindowMaxButton =   -1  'True
      WindowMinButton =   -1  'True
      PrintFileName   =   "factura"
      PrintFileType   =   17
      PrintFileLinesPerPage=   60
   End
   Begin MSDBGrid.DBGrid detalle 
      Bindings        =   "frmremito.frx":5304
      Height          =   5055
      Left            =   0
      OleObjectBlob   =   "frmremito.frx":5318
      TabIndex        =   0
      Top             =   2880
      Width           =   11655
   End
   Begin VB.Label lbltipofac 
      Alignment       =   2  'Center
      BackColor       =   &H8000000A&
      BorderStyle     =   1  'Fixed Single
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   24
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   5160
      TabIndex        =   31
      Top             =   360
      Width           =   735
   End
   Begin VB.Line Line1 
      X1              =   5520
      X2              =   5520
      Y1              =   0
      Y2              =   360
   End
   Begin VB.Line Line2 
      X1              =   5520
      X2              =   5520
      Y1              =   960
      Y2              =   1440
   End
   Begin VB.Line Line3 
      X1              =   0
      X2              =   11640
      Y1              =   1440
      Y2              =   1440
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Presupuesto"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   13.5
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   360
      Index           =   0
      Left            =   120
      TabIndex        =   30
      Top             =   120
      Width           =   1590
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Nro de Presupuesto:"
      Height          =   195
      Index           =   1
      Left            =   8160
      TabIndex        =   29
      Top             =   600
      Width           =   1455
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Fecha:"
      Height          =   195
      Index           =   2
      Left            =   9000
      TabIndex        =   28
      Top             =   960
      Width           =   495
   End
   Begin VB.Label lblnrofactura 
      Alignment       =   2  'Center
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   9720
      TabIndex        =   27
      Top             =   600
      Width           =   1695
   End
   Begin VB.Label lblfecha 
      Alignment       =   2  'Center
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   9720
      TabIndex        =   26
      Top             =   960
      Width           =   1695
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Codigo de cliente"
      Height          =   195
      Index           =   3
      Left            =   600
      TabIndex        =   25
      Top             =   1680
      Width           =   1230
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Direccion"
      Height          =   195
      Index           =   4
      Left            =   600
      TabIndex        =   24
      Top             =   2400
      Width           =   675
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Razon social"
      Height          =   195
      Index           =   5
      Left            =   600
      TabIndex        =   23
      Top             =   2040
      Width           =   915
   End
   Begin VB.Label lblcodcli 
      Alignment       =   2  'Center
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   2520
      TabIndex        =   22
      Top             =   1680
      Width           =   1335
   End
   Begin VB.Label lbldireccion 
      Alignment       =   2  'Center
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   1440
      TabIndex        =   21
      Top             =   2400
      Width           =   2415
   End
   Begin VB.Label lblrazon 
      Alignment       =   2  'Center
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   1680
      TabIndex        =   20
      Top             =   2040
      Width           =   2175
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Condicion IVA"
      Height          =   195
      Index           =   6
      Left            =   8760
      TabIndex        =   19
      Top             =   2400
      Width           =   1005
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "C.U.I.T."
      Height          =   195
      Index           =   7
      Left            =   8760
      TabIndex        =   18
      Top             =   2040
      Width           =   555
   End
   Begin VB.Label lblcondiva 
      Alignment       =   2  'Center
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   10200
      TabIndex        =   17
      Top             =   2400
      Width           =   1095
   End
   Begin VB.Label lblcuit 
      Alignment       =   2  'Center
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   9480
      TabIndex        =   16
      Top             =   2040
      Width           =   1815
   End
   Begin VB.Line Line4 
      X1              =   0
      X2              =   11640
      Y1              =   2760
      Y2              =   2760
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Sub-Total:"
      Height          =   195
      Index           =   8
      Left            =   8520
      TabIndex        =   15
      Top             =   8520
      Width           =   735
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "IVA 21%:"
      Height          =   195
      Index           =   9
      Left            =   8760
      TabIndex        =   14
      Top             =   8925
      Width           =   645
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "TOTAL:"
      Height          =   195
      Index           =   10
      Left            =   8760
      TabIndex        =   13
      Top             =   9600
      Width           =   570
   End
   Begin VB.Label lblsubtotal 
      Alignment       =   1  'Right Justify
      BorderStyle     =   1  'Fixed Single
      BeginProperty DataFormat 
         Type            =   1
         Format          =   "0,00"
         HaveTrueFalseNull=   0
         FirstDayOfWeek  =   0
         FirstWeekOfYear =   0
         LCID            =   11274
         SubFormatType   =   1
      EndProperty
      Height          =   255
      Left            =   9600
      TabIndex        =   12
      Top             =   8520
      Width           =   1815
   End
   Begin VB.Label lbliva21 
      Alignment       =   1  'Right Justify
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   9600
      TabIndex        =   11
      Top             =   8925
      Width           =   1815
   End
   Begin VB.Label lbltotal 
      Alignment       =   1  'Right Justify
      BorderStyle     =   1  'Fixed Single
      BeginProperty DataFormat 
         Type            =   1
         Format          =   "0,000"
         HaveTrueFalseNull=   0
         FirstDayOfWeek  =   0
         FirstWeekOfYear =   0
         LCID            =   11274
         SubFormatType   =   1
      EndProperty
      Height          =   255
      Left            =   9600
      TabIndex        =   10
      Top             =   9600
      Width           =   1815
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Son Pesos:"
      Height          =   195
      Index           =   11
      Left            =   120
      TabIndex        =   9
      Top             =   8160
      Width           =   810
   End
   Begin VB.Label lblenletras 
      Alignment       =   2  'Center
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   1080
      TabIndex        =   8
      Top             =   8160
      Width           =   4575
   End
   Begin VB.Label lbllista 
      Alignment       =   2  'Center
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   9960
      TabIndex        =   7
      Top             =   1680
      Width           =   1335
   End
   Begin VB.Label Label1 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Lista de precio"
      Height          =   195
      Left            =   8760
      TabIndex        =   6
      Top             =   1680
      Width           =   1035
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H8000000E&
      Caption         =   "Bonificacion:"
      Height          =   195
      Index           =   13
      Left            =   8520
      TabIndex        =   5
      Top             =   8160
      Width           =   915
   End
   Begin VB.Label lblbonif 
      Alignment       =   1  'Right Justify
      BorderStyle     =   1  'Fixed Single
      Height          =   255
      Left            =   9600
      TabIndex        =   4
      Top             =   8160
      Width           =   1815
   End
End
Attribute VB_Name = "frmremito"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False

Private Sub DBGrid1_Click()


End Sub

Private Sub cmdborrarboton_Click()
Data1.Recordset.Delete
Data1.Recordset.MoveNext
Data1.Recordset.MoveFirst
For n = 1 To 24
    Data1.Recordset.Edit
    Data1.Recordset!R = n
    Data1.Recordset.Update
    Data1.Recordset.MoveNext
Next
Data1.Recordset.AddNew
Data1.Recordset!R = 25
Data1.Recordset.Update
Data1.Recordset.MoveFirst
Data1.Refresh
calculartotales
End Sub

Private Sub cmdcancelar_Click()
flagbuscarclientes = 0

Unload Me

End Sub
Private Sub cmdfact2_Click()

End Sub

Private Sub Cmdimprimir_Click()
informe1.ReportFileName = App.Path & "\factura crystal.rpt"
informe1.Formulas(0) = "Nrofac='" & lblnrofactura.Caption & "'"
informe1.Formulas(1) = "Fecha='" & lblfecha.Caption & "'"
informe1.Formulas(2) = "CodCli='" & lblcodcli.Caption & "'"
informe1.Formulas(3) = "Razon='" & lblrazon.Caption & "'"
informe1.Formulas(4) = "Direccion='" & lbldireccion.Caption & "'"
informe1.Formulas(5) = "Lista='" & lbllista.Caption & "'"
informe1.Formulas(6) = "CUIT='" & lblcuit.Caption & "'"
informe1.Formulas(7) = "CondIVA='" & lblcondiva.Caption & "'"
informe1.Formulas(8) = "Subtotal='" & lblsubtotal.Caption & "'"
informe1.Formulas(9) = "IVA21='" & lbliva21.Caption & "'"
'informe1.Formulas(10) = "IVA105='" & lbliva105.Caption & "'"
informe1.Formulas(11) = "Total='" & lbltotal.Caption & "'"
informe1.Formulas(12) = "Letra='" & lblenletras.Caption & "'"
informe1.Formulas(13) = "Bonif='" & lblbonif.Caption & "'"
informe1.Action = 1
guardarfactura

'Form_Activate
'Form_Load


End Sub

Private Sub detalle_AfterColUpdate(ByVal ColIndex As Integer)

If ColIndex = 1 Or ColIndex = 2 Then
    marcar
    If ColIndex = 1 Then
        Campo = "marca"
        Criterio = Data1.Recordset!marca
    Else
        Campo = "codfab"
        Criterio = Data1.Recordset!Articulo
    End If
    frmbuscararticulo.Show 1
        rArt.FindFirst "codigo='" & Criterio & "'"
        If Not rArt.NoMatch Then
            Data1.Recordset.Edit
            Data1.Recordset!marca = rArt!marca
            Data1.Recordset!Articulo = rArt!codfab
            Data1.Recordset!descripcion = rArt!descripcion
            

           If lbllista.Caption = "Publico" Then
              Data1.Recordset!unitario = rArt!preciol1
            ElseIf lbllista.Caption = "Gremio" Then
                   Data1.Recordset!unitario = rArt!preciol2
            ElseIf lbllista.Caption = "Mayorista" Then
                     Data1.Recordset!unitario = rArt!preciol3
            End If
                    
            Data1.Recordset.Update
        Else
            MsgBox "codigo no encontrado", vbCritical, "mensaje"
        End If
End If

        
        
        
End Sub

Private Sub detalle_BeforeColUpdate(ByVal ColIndex As Integer, OldValue As Variant, Cancel As Integer)


If ColIndex = 4 Or ColIndex = 5 Or ColIndex = 6 Then
    Dim coma As Boolean
    If Mid(Format(1.5, "fixed"), 2, 1) = "," Then coma = True
    If coma = True Then
        posicion = InStr(1, detalle.Columns(ColIndex), ".", vbTextCompare)
        If posicion > 0 Then
            x = detalle.Columns(ColIndex)
            x = Left(x, posicion - 1) & "," & Right(x, Len(x) - posicion)
            detalle.Columns(ColIndex) = x
        End If
    End If
End If

    
End Sub

Private Sub detalle_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then
    If detalle.Col = 0 Then
        SendKeys "{TAB}", True
    ElseIf detalle.Col = 1 Then
        SendKeys "{TAB}", True
    ElseIf detalle.Col = 2 Then
        SendKeys "{TAB}", True
    ElseIf detalle.Col = 3 Then
        SendKeys "{TAB}", True
       
    ElseIf detalle.Col = 4 Then
        SendKeys "{TAB}", True
    ElseIf detalle.Col = 5 Then
        SendKeys "{TAB}", True
    ElseIf detalle.Col = 6 Then
        marcar
        Data1.Recordset.Edit
        Data1.Recordset!total = (Data1.Recordset!unitario * Data1.Recordset!cantidad)
        Data1.Recordset.Update
        detalle.Col = 0
        calculartotales
    End If
End If

End Sub
Private Sub marcar()
If Data1.Recordset.EOF = False Then
        Data1.Recordset.Bookmark = Data1.Recordset.Bookmark
End If
End Sub
Private Sub calculartotales()
    vSubtotal = 0
    vIva21 = 0
    vIva105 = 0
    vBonif = 0
    Data1.Recordset.MoveFirst
    Do While Not Data1.Recordset.EOF
        If Data1.Recordset!total <> 0 Then
          Calculo
          vSubtotal = vSubtotal + Data1.Recordset!total
          'If Data1.Recordset!aliiva = 10.5 Then
                'vIva105 = vIva105 + (Data1.Recordset!total - vBonif) * Data1.Recordset!aliiva / 100
            'End If
            
            
        Else
            Exit Do
        End If
        Data1.Recordset.MoveNext
    Loop
    vSubtotal = vSubtotal - vBonif
    vIva21 = (vSubtotal * 0.21)
    vtotal = (vSubtotal + vIva21)
    
    'mostrar el subtotal
    lblbonif.Caption = Format(vBonif, "currency")
    lblsubtotal.Caption = Format(vSubtotal, "currency")
    lbliva21.Caption = Format(vIva21, "currency")
    'lbliva105.Caption = Format(vIva105, "currency")
    lbltotal.Caption = Format(vtotal, "currency")
    lblenletras.Caption = LETRAS(Round(vtotal, 2))
    
    
        
End Sub
Private Sub Calculo()

For n = 0 To 25
    If detalle.Row = n Then
        If Data1.Recordset!bonif <> 0 Then
            vBonif = vBonif + (Data1.Recordset!total * (Data1.Recordset!bonif / 100))
        End If
    End If
Next

End Sub

Private Sub detalle_RowColChange(LastRow As Variant, ByVal LastCol As Integer)
If LastCol = 4 Or LastCol = 5 Or LastCol = 6 Then
    If Not IsNumeric(detalle.Columns(LastCol)) Then
        MsgBox "dato no valido, debe ingresar solo numeros..", vbCritical, "mensaje"
        detalle.Columns(LastCol) = 0
        SendKeys "+{tab}", True
    End If
End If

End Sub

Private Sub Form_Activate()
 If flagbuscarclientes = 0 Then
    
    flagbuscarclientes = 1
        lbltipofac.Caption = ""
        lblcodcli.Caption = " "
        lblrazon.Caption = " "
        lbldireccion.Caption = " "
        lblcuit.Caption = " "
        lblcondiva.Caption = " "
        lbllista.Caption = " "
        lblbonif.Caption = " "
    lblsubtotal.Caption = " "
    lbliva21.Caption = " "
    'lbliva105.Caption = " "
    lbltotal.Caption = " "
    lblenletras.Caption = " "
        Criterio = InputBox("ingrese codigo o razon social del cliente", "buscar cliente")
        If Criterio <> "" Then
            If IsNumeric(Criterio) Then
                Criterio = Trim(Criterio)
                Criterio = String(5 - Len(Criterio), "0") & Criterio
                Campo = "codcli"
            Else
                Criterio = UCase(Trim(Criterio))
                Campo = "razon"
            End If
            frmclientesbuscar.Show vbModal
            rClientes.FindFirst "codcli='" & Criterio & "'"
            If Not rClientes.NoMatch Then
                vcodcli = rClientes!codcli
                vrazon = rClientes!razon
              
                lbltipofac.Caption = "R"
                lblcodcli.Caption = IIf(IsNull(rClientes!codcli), "", vcodcli)
                lblrazon.Caption = IIf(IsNull(rClientes!razon), "", vrazon)
                lbllista.Caption = IIf(IsNull(rClientes!lista), "", rClientes!lista)
                lbldireccion.Caption = IIf(IsNull(rClientes!direccion), "", rClientes!direccion)
                lblcuit.Caption = IIf(IsNull(rClientes!cuit), "", rClientes!cuit)
                lblcondiva.Caption = IIf(IsNull(rClientes!condiva), "", rClientes!condiva)
                
                If lbltipofac.Caption = "R" Then
                    lblnrofactura.Caption = "0000-" & strzero(rContador!nroremito, 8)
                Else
                    lblnrofactura.Caption = "0000-" & strzero(rContador!nrofacB, 8)
                End If
                lblfecha.Caption = Date
            End If
        
            If lbllista.Caption = "Mayorista" Then
            detalle.Enabled = True
            frmcontra.Show
            End If
        
        Else
            Unload Me
        End If
   
End If


            
        
End Sub

Private Sub Form_Load()
miBase.Execute "delete * from TemporalDetalleremito"
For n = 1 To 25
    miBase.Execute "insert into TemporalDetalleremito (r) values(" & n & ")"
    
Next

Set rClientes = miBase.OpenRecordset("select * from clientes order by codcli", dbOpenDynaset)
Set rArt = miBase.OpenRecordset("select * from articulos order by marca", dbOpenDynaset)
Set rFacturas = miBase.OpenRecordset("select * from remitos order by nrodoc", dbOpenDynaset)
Set rFacturasDetalle = miBase.OpenRecordset("select * from remitodetalle", dbOpenDynaset)
Set rTemporalDetalledeFacturas = miBase.OpenRecordset("select * from temporaldetalleremito order by r", dbOpenDynaset)
Set Data1.Recordset = rTemporalDetalledeFacturas
Data1.Refresh

End Sub
Private Sub guardarfactura()
rFacturas.AddNew
rFacturas!tipodoc = "FAC"
rFacturas!nrodoc = lbltipofac.Caption & lblnrofactura.Caption
rFacturas!reflejo = lbltipofac.Caption & lblnrofactura.Caption
rFacturas!fecha = Date
rFacturas!codcli = lblcodcli.Caption
rFacturas!razon = lblrazon.Caption
rFacturas!condi = lblcondiva.Caption
rFacturas!subtotal = vSubtotal
rFacturas!bonif = vBonif
rFacturas!iva21 = vIva21
rFacturas!total = vtotal
rFacturas!resto = vtotal
rFacturas!estado = "P"
rFacturas!vencimiento = Date + 30
rFacturas.Update
With Data1.Recordset
    .MoveFirst
    Do While Not .EOF
        If !total <> 0 Then
            rFacturasDetalle.AddNew
            rFacturasDetalle!tipomov = "VEN"
            rFacturasDetalle!nrodoc = lbltipofac.Caption & lblnrofactura.Caption
            rFacturasDetalle!fecha = Date
            rFacturasDetalle!marca = !marca
            rFacturasDetalle!codfab = !Articulo
            rFacturasDetalle!descripcion = !descripcion
            rFacturasDetalle!cantidad = !cantidad
            rFacturasDetalle!unitario = !unitario
            rFacturasDetalle!codcli = lblcodcli.Caption
            rFacturasDetalle!razon = lblrazon.Caption
            rFacturasDetalle!total = lbltotal.Caption
            rFacturasDetalle!bonif = vBonif
            rFacturasDetalle.Update
        End If
     .MoveNext
    Loop
End With

rContador.Edit
If lbltipofac.Caption = "R" Then
    rContador!nroremito = rContador!nroremito + 1

End If
rContador.Update
 

flagbuscarclientes = 0

Unload Me
End Sub



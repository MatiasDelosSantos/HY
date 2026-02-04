VERSION 5.00
Object = "{00028C01-0000-0000-0000-000000000046}#1.0#0"; "DBGRID32.OCX"
Object = "{86CF1D34-0C5F-11D2-A9FC-0000F8754DA1}#2.0#0"; "MSCOMCT2.OCX"
Begin VB.Form frmcobranza 
   BackColor       =   &H00C0FFC0&
   Caption         =   "Cobranzas"
   ClientHeight    =   8385
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   11505
   LinkTopic       =   "Form1"
   ScaleHeight     =   8385
   ScaleWidth      =   11505
   StartUpPosition =   2  'CenterScreen
   Begin VB.TextBox txtunidad 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   435
      Left            =   4440
      TabIndex        =   21
      Top             =   1440
      Width           =   975
   End
   Begin VB.TextBox txttipodoc 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   435
      Left            =   2640
      TabIndex        =   20
      Top             =   1440
      Width           =   1455
   End
   Begin VB.TextBox txtrecibo 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   435
      Left            =   5520
      TabIndex        =   5
      Top             =   1440
      Width           =   1455
   End
   Begin VB.TextBox txtimporte 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   405
      Left            =   7200
      TabIndex        =   4
      Top             =   1440
      Width           =   1695
   End
   Begin VB.CommandButton cmdaceptar 
      BackColor       =   &H0080FF80&
      Caption         =   "&Aceptar"
      Height          =   735
      Left            =   6360
      Picture         =   "frmcobranza.frx":0000
      Style           =   1  'Graphical
      TabIndex        =   3
      Top             =   120
      Width           =   1455
   End
   Begin VB.CommandButton cmdcancelar 
      BackColor       =   &H0000FF00&
      Caption         =   "&Cancelar"
      Height          =   735
      Left            =   8160
      Picture         =   "frmcobranza.frx":2982
      Style           =   1  'Graphical
      TabIndex        =   2
      Top             =   120
      Width           =   1455
   End
   Begin VB.Data Data1 
      Caption         =   "Data1"
      Connect         =   "Access"
      DatabaseName    =   ""
      DefaultCursorType=   0  'DefaultCursor
      DefaultType     =   2  'UseODBC
      Exclusive       =   0   'False
      Height          =   375
      Left            =   240
      Options         =   0
      ReadOnly        =   0   'False
      RecordsetType   =   0  'Table
      RecordSource    =   ""
      Top             =   6720
      Visible         =   0   'False
      Width           =   1575
   End
   Begin VB.CommandButton cmdsalir 
      BackColor       =   &H000000FF&
      Caption         =   "&Salir"
      Height          =   855
      Left            =   7080
      Picture         =   "frmcobranza.frx":2C8C
      Style           =   1  'Graphical
      TabIndex        =   1
      Top             =   7440
      Width           =   1215
   End
   Begin VB.Timer Timer1 
      Interval        =   300
      Left            =   4680
      Top             =   7560
   End
   Begin MSDBGrid.DBGrid dbfactpend 
      Bindings        =   "frmcobranza.frx":560E
      Height          =   3855
      Left            =   120
      OleObjectBlob   =   "frmcobranza.frx":5622
      TabIndex        =   0
      Top             =   2640
      Width           =   11295
   End
   Begin MSComCtl2.DTPicker DTPfecha 
      Height          =   495
      Left            =   120
      TabIndex        =   19
      Top             =   1440
      Width           =   2055
      _ExtentX        =   3625
      _ExtentY        =   873
      _Version        =   393216
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851} 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Format          =   21299201
      CurrentDate     =   39766
   End
   Begin VB.Label lblrazon 
      BorderStyle     =   1  'Fixed Single
      Height          =   375
      Left            =   120
      TabIndex        =   18
      Top             =   480
      Width           =   4455
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00FFFF80&
      BackStyle       =   0  'Transparent
      Caption         =   "Cliente"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   405
      Index           =   0
      Left            =   120
      TabIndex        =   17
      Top             =   0
      Width           =   945
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00FFFF80&
      BackStyle       =   0  'Transparent
      Caption         =   "Fecha de cobranza"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   345
      Index           =   1
      Left            =   120
      TabIndex        =   16
      Top             =   1080
      Width           =   2040
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00FFFF80&
      BackStyle       =   0  'Transparent
      Caption         =   "Tipo de documento"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   345
      Index           =   2
      Left            =   2400
      TabIndex        =   15
      Top             =   1080
      Width           =   2025
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00FFFF80&
      BackStyle       =   0  'Transparent
      Caption         =   "Nro de Recibo"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   345
      Index           =   3
      Left            =   4920
      TabIndex        =   14
      Top             =   1080
      Width           =   1590
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00FFFF80&
      BackStyle       =   0  'Transparent
      Caption         =   "Importe cobrado"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   345
      Index           =   4
      Left            =   7200
      TabIndex        =   13
      Top             =   1080
      Width           =   1860
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00FFFF80&
      BackStyle       =   0  'Transparent
      Caption         =   "Saldo"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   345
      Index           =   5
      Left            =   9480
      TabIndex        =   12
      Top             =   1080
      Width           =   615
   End
   Begin VB.Label lblsaldo 
      BorderStyle     =   1  'Fixed Single
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   9120
      TabIndex        =   11
      Top             =   1440
      Width           =   1455
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00FFFF80&
      BackStyle       =   0  'Transparent
      Caption         =   "Suma de Totales"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   345
      Index           =   6
      Left            =   2760
      TabIndex        =   10
      Top             =   6720
      Width           =   1785
   End
   Begin VB.Label lbltotalgral 
      BorderStyle     =   1  'Fixed Single
      Height          =   375
      Left            =   4680
      TabIndex        =   9
      Top             =   6720
      Width           =   1455
   End
   Begin VB.Label lbltotalresto 
      BorderStyle     =   1  'Fixed Single
      Height          =   375
      Left            =   7080
      TabIndex        =   8
      Top             =   6720
      Width           =   1575
   End
   Begin VB.Label lbltotalcobrado 
      BorderStyle     =   1  'Fixed Single
      Height          =   375
      Left            =   8880
      TabIndex        =   7
      Top             =   6720
      Width           =   1575
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00FFFF80&
      BackStyle       =   0  'Transparent
      Caption         =   "Facturas pendientes del cliente actual"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   405
      Index           =   7
      Left            =   2880
      TabIndex        =   6
      Top             =   2040
      Width           =   5310
   End
   Begin VB.Shape Shape1 
      BorderColor     =   &H00404040&
      BorderWidth     =   6
      Height          =   4095
      Left            =   0
      Top             =   2520
      Visible         =   0   'False
      Width           =   11535
   End
End
Attribute VB_Name = "frmcobranza"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub cbotipodoc_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub cbounidad_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub cmdaceptar_Click()
cmdaceptar.Enabled = False
cmdcancelar.Enabled = False
    If Data1.Recordset.RecordCount > 0 Then
        Data1.Recordset.MoveFirst
        Do While Not Data1.Recordset.EOF
            rFacturas.MoveFirst
            rFacturas.FindFirst "nrodoc='" & Data1.Recordset!nrodoc & "' and tipodoc='FAC'"
        If Not rFacturas.NoMatch Then
            rFacturas.Edit
            rFacturas!estado = Data1.Recordset!estado
            rFacturas!resto = Data1.Recordset!resto
            rFacturas.Update
        End If
        Data1.Recordset.MoveNext
        Loop
        Data1.Recordset.MoveFirst
        Do While Not Data1.Recordset.EOF
           If Data1.Recordset!cobrado > 0 Then
                rFacturas.AddNew
                rFacturas!nrodoc = "R" & txtunidad.Text & "-" & txtrecibo.Text
                rFacturas!fecha = DTPfecha.Value
                rFacturas!reflejo = Data1.Recordset!nrodoc
                rFacturas!codcli = Data1.Recordset!codcli
                rFacturas!razon = Data1.Recordset!razon
                rFacturas!condi = Data1.Recordset!condi
                rFacturas!total = Data1.Recordset!cobrado
                rFacturas!estado = "R"
                rFacturas!tipodoc = Data1.Recordset!tipodoc
                rFacturas.Update
         End If
            Data1.Recordset.MoveNext
        Loop
    End If
        If CSng(lblsaldo.Caption) > 0 Then 'guarda dinero a favor del cliente...
            rFacturas.AddNew
            rFacturas!nrodoc = "R" & txtunidad.Text & "-" & txtrecibo.Text
            rFacturas!fecha = DTPfecha.Value
            rFacturas!reflejo = "X" & txtunidad.Text & "-00000000"
            rFacturas!codcli = vcodcli
            rFacturas!razon = vrazon
            rFacturas!resto = lbltotalresto.Caption
            rFacturas!total = lblsaldo.Caption
            rFacturas!estado = "R"
            rFacturas!tipodoc = txttipodoc.Text
            rFacturas.Update
     End If
    rContador.Edit
    rContador!NroRec = rContador!NroRec + 1
    rContador.Update
txttipodoc.Text = "Rec"
txtunidad.Text = "0001"
txtrecibo.Text = ""
txtimporte.Text = ""
lblsaldo.Caption = ""
DTPfecha.SetFocus

Shape1.Visible = False
Data1.Refresh
Dim confirma As String
confirma = MsgBox("Desea realizar otra operacion  ", vbYesNo, "confirmacion")
        If confirma = vbYes Then
            flagbuscarclientes = 0
            Form_Activate
         Else
            flagbuscarclientes = 0
            Unload Me
        End If
     
End Sub

Private Sub cmdcancelar_Click()
txttipodoc.Text = "Rec"
txtunidad.Text = "0001"
txtrecibo.Text = ""
txtimporte.Text = ""
lblsaldo.Caption = ""

DTPfecha.SetFocus
flagbuscarclientes = 0
Set rTemporalcobranzas = miBase.OpenRecordset("temporalcobranzas", dbOpenDynaset)
If rTemporalcobranzas.RecordCount > 0 Then
    rTemporalcobranzas.MoveFirst
    Do While Not rTemporalcobranzas.EOF
        rTemporalcobranzas.Delete
        rTemporalcobranzas.MoveNext
    Loop
    Shape1.Visible = False
End If


Data1.Refresh

Form_Activate

End Sub

Private Sub cmdsalir_Click()
flagbuscarclientes = 0
Unload Me
End Sub

Private Sub dbfactpend_DblClick()
        If CSng(lblsaldo.Caption) > 0 Then
            If Data1.Recordset!resto > 0 Then
                lbltotalgral.Enabled = False
                Data1.Recordset.Edit
                If CSng(lblsaldo.Caption) >= Data1.Recordset!resto Then
                    Data1.Recordset!cobrado = Data1.Recordset!resto
                    lblsaldo.Caption = Round(lblsaldo.Caption - Data1.Recordset!resto, 2)
                    Data1.Recordset!resto = 0
                    Data1.Recordset!estado = "C"
                Else
                    Data1.Recordset!cobrado = lblsaldo.Caption
                    Data1.Recordset!resto = Data1.Recordset!resto - lblsaldo.Caption
                    lblsaldo.Caption = 0
                End If
                Data1.Recordset!tipodoc = txttipodoc.Text
                Data1.Recordset.Update
                cmdaceptar.Enabled = True
                cmdcancelar.Enabled = True
             End If
        Else
            cmdaceptar.SetFocus
            MsgBox "no queda mas dinero para imputar," & vbCrLf & "Acepte las imputaciones y luego " & vbCrLf & _
                    "cargue otra cobranza, o cancele.", vbCritical, "mensaje de error en cobranzas"
        End If
        Set rSumaTemporalCobranzas = miBase.OpenRecordset("SELECT sum(temporalcobranzas.TOTAL) AS SumaDeTOTAL, " & _
            "sum (temporalcobranzas.RESTO) as SumaDeRESTO , sum(Temporalcobranzas.COBRADO) AS SumaDeCOBRADO " & _
            "FROM Temporalcobranzas", dbOpenDynaset)
        rSumaTemporalCobranzas.MoveFirst
        lbltotalgral.Caption = Format(rSumaTemporalCobranzas!SumaDeTOTAL, "fixed")
        lbltotalresto.Caption = Format(rSumaTemporalCobranzas!SumaDeRESTO, "fixed")
        lbltotalcobrado.Caption = Format(rSumaTemporalCobranzas!SumaDeCOBRADO, "fixed")
End Sub

Private Sub dbfactpend_KeyDown(KeyCode As Integer, Shift As Integer)
    If KeyCode = 13 Then dbfactpend_DblClick
   
End Sub

Private Sub DTPfecha_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub Form_Activate()
If flagbuscarclientes = 0 Then
    flagbuscarclientes = 1
    cmdaceptar.Enabled = False
    miBase.Execute "delete * from temporalcobranzas"
    Set rClientes = miBase.OpenRecordset("clientes", dbOpenDynaset)
    
    Set rSumaTemporalCobranzas = miBase.OpenRecordset("Select sum (TemporalCobranzas.TOTAL) as SumaDeTotal, sum(TemporalCobranzas.RESTO) as sumaDeResto, Sum (TemporalCobranzas.COBRADO) as SumaDeCobrado " & "From TemporalCobranzas", dbOpenDynaset)
    Set rTemporalcobranzas = miBase.OpenRecordset("temporalcobranzas", dbOpenDynaset)
    rSumaTemporalCobranzas.MoveFirst
    
    txttipodoc.Text = "Rec"
    lblrazon.Caption = ""
    DTPfecha.Value = Date
    txtrecibo.Text = strzero(rContador!NroRec, 5)
    txtimporte.Text = ""
    lblsaldo.Caption = ""
    txtunidad.Text = "0001"
    lbltotalgral.Caption = Format(rSumaTemporalCobranzas!SumaDeTOTAL, "fixed")
    lbltotalresto.Caption = Format(rSumaTemporalCobranzas!SumaDeRESTO, "fixed")
    lbltotalcobrado.Caption = Format(rSumaTemporalCobranzas!SumaDeCOBRADO, "fixed")
    
    Set Data1.Recordset = rTemporalcobranzas
    Data1.Refresh
    Criterio = InputBox("Ingresar codigo del Cliente o razon social", "elegir cliente")
    If Criterio = "" Then
        Unload Me
    Else
        If IsNumeric(Criterio) Then
            Campo = "codcli"
            Criterio = strzero(Criterio, 5)
        Else
            Campo = "razon"
        End If
        frmclientesbuscar.Show 1
        
        rClientes.FindFirst "codcli like '*" & Criterio & "*'"
        If Not rClientes.NoMatch Then
                txtimporte.Enabled = True
                
                vcodcli = rClientes!codcli
                vrazon = rClientes!razon
                lblrazon.Caption = vcodcli & "/" & vrazon
                Set rFacturas = miBase.OpenRecordset("select * from Remitos where codcli='" & vcodcli & "'", dbOpenDynaset)
                miBase.Execute "insert into temporalcobranzas (NRODOC,CODCLI,FECHA,CONDI,TOTAL," & _
                                "ESTADO,VENCIMIENTO,RESTO,RAZON) " & _
                                "SELECT remitos.NRODOC,remitos.CODCLI,remitos.FECHA,remitos.CONDI,remitos.TOTAL," & _
                                      "remitos.ESTADO,remitos.VENCIMIENTO, remitos.RESTO, remitos.RAZON from remitos " & _
                                "WHERE remitos.CODCLI='" & vcodcli & "' AND remitos.RESTO>0 AND TIPODOC = 'FAC'"
                Set rSumaTemporalCobranzas = miBase.OpenRecordset("SELECT sum(temporalcobranzas.TOTAL) as sumadetotal, sum(temporalcobranzas.RESTO) as sumaderesto, sum(temporalcobranzas.COBRADO) as sumadecobrado " & _
                                                                "FROM temporalcobranzas", dbOpenDynaset)
                Set rTemporalcobranzas = miBase.OpenRecordset("temporalcobranzas", dbOpenDynaset)
                
                rSumaTemporalCobranzas.MoveFirst
                lbltotalgral.Caption = Format(rSumaTemporalCobranzas!SumaDeTOTAL, "fixed")
                lbltotalresto.Caption = Format(rSumaTemporalCobranzas!SumaDeRESTO, "fixed")
                lbltotalcobrado.Caption = Format(rSumaTemporalCobranzas!SumaDeCOBRADO, "fixed")
                
                Set rTemporalcobranzas = miBase.OpenRecordset("temporalcobranzas", dbOpenDynaset)
                Set Data1.Recordset = rTemporalcobranzas
                Data1.Refresh
                
                If Data1.Recordset.RecordCount <= 0 Then
                    If MsgBox("no hay factura adeudadas por este cliente," & vbCrLf & _
                                "quiere cargar un pago a cuenta de futuras facturas.", vbYesNo + vbQuestion, "mensaje") = vbYes Then
                    Else
                       flagbuscarcliente = 0
                      
                       Form_Activate
                    End If
                    
                End If
                 dbfactpend.Enabled = False
                 
        End If
    End If
End If
    
    
    
End Sub


Private Sub Timer1_Timer()
    If Shape1.BorderColor = &HFF00& Then
        Shape1.BorderColor = &H404040
    Else
        Shape1.BorderColor = &HFF00&
    End If
End Sub

Private Sub txtimporte_Change()
Dim coma As Boolean
If txtimporte.Text <> "" Then
    If Mid(Format(1.5, "fixed"), 2, 1) = "," Then coma = True
    If coma = True Then
        posicion = InStr(1, txtimporte.Text, ".", vbTextCompare)
        If posicion > 0 Then
            x = txtimporte.Text
            x = Left(x, posicion - 1) & "," & Right(x, Len(x) - posicion)
            txtimporte.Text = x
            txtimporte.SelStart = Len(txtimporte.Text) + 1
        End If
    
    End If
    lblsaldo.Caption = txtimporte.Text
    dbfactpend.Enabled = True
Else
    dbfactpend.Enabled = False
End If

End Sub



Private Sub txtimporte_KeyPress(KeyAscii As Integer)
        
    If KeyAscii = 13 Then
    Shape1.Visible = True
    dbfactpend.SetFocus
    
    End If
    
End Sub

Private Sub txtrecibo_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True

End Sub

Private Sub txtrecibo_KeyPress(KeyAscii As Integer)
If KeyAscii = 13 Then
    If cbounidad.ListIndex > -1 Then
         txtrecibo.Text = String(7 - Len(txtrecibo), "0") & txtrecibo.Text
         
    End If
End If
End Sub



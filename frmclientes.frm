VERSION 5.00
Begin VB.Form frmclientes 
   BackColor       =   &H00C0FFC0&
   Caption         =   "Clientes"
   ClientHeight    =   10050
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   10800
   LinkTopic       =   "Form1"
   ScaleHeight     =   10050
   ScaleWidth      =   10800
   StartUpPosition =   2  'CenterScreen
   Begin VB.CommandButton cmddesplazar 
      BackColor       =   &H0080FF80&
      Height          =   735
      Index           =   0
      Left            =   240
      Picture         =   "frmclientes.frx":0000
      Style           =   1  'Graphical
      TabIndex        =   27
      Top             =   8040
      Width           =   975
   End
   Begin VB.CommandButton cmddesplazar 
      BackColor       =   &H0080FF80&
      Height          =   735
      Index           =   1
      Left            =   1320
      Picture         =   "frmclientes.frx":2982
      Style           =   1  'Graphical
      TabIndex        =   26
      Top             =   8040
      Width           =   975
   End
   Begin VB.CommandButton cmddesplazar 
      BackColor       =   &H0080FF80&
      Height          =   735
      Index           =   2
      Left            =   2400
      Picture         =   "frmclientes.frx":5304
      Style           =   1  'Graphical
      TabIndex        =   25
      Top             =   8040
      Width           =   975
   End
   Begin VB.CommandButton cmddesplazar 
      BackColor       =   &H0080FF80&
      Height          =   735
      Index           =   3
      Left            =   3480
      Picture         =   "frmclientes.frx":7C86
      Style           =   1  'Graphical
      TabIndex        =   24
      Top             =   8040
      Width           =   975
   End
   Begin VB.ComboBox cboci 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      ItemData        =   "frmclientes.frx":A608
      Left            =   3720
      List            =   "frmclientes.frx":A61B
      TabIndex        =   5
      Top             =   5400
      Width           =   1335
   End
   Begin VB.ComboBox cbofac 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      ItemData        =   "frmclientes.frx":A636
      Left            =   240
      List            =   "frmclientes.frx":A640
      TabIndex        =   6
      Top             =   6840
      Width           =   1095
   End
   Begin VB.ComboBox cboL 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      ItemData        =   "frmclientes.frx":A64A
      Left            =   3720
      List            =   "frmclientes.frx":A657
      TabIndex        =   7
      Top             =   6840
      Width           =   2175
   End
   Begin VB.TextBox txtrazon 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   585
      Left            =   240
      MaxLength       =   150
      TabIndex        =   1
      Top             =   2520
      Width           =   2895
   End
   Begin VB.TextBox txtdir 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   585
      Left            =   240
      MaxLength       =   150
      TabIndex        =   2
      Top             =   3960
      Width           =   2895
   End
   Begin VB.TextBox txtcuit 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   585
      Left            =   3720
      MaxLength       =   13
      TabIndex        =   3
      Top             =   3960
      Width           =   2895
   End
   Begin VB.TextBox txttel 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   585
      Left            =   240
      MaxLength       =   50
      TabIndex        =   4
      Top             =   5400
      Width           =   1935
   End
   Begin VB.CommandButton cmdagregar 
      BackColor       =   &H0080FF80&
      Caption         =   "Agregar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8520
      Picture         =   "frmclientes.frx":A677
      Style           =   1  'Graphical
      TabIndex        =   14
      Top             =   1680
      Width           =   1815
   End
   Begin VB.CommandButton cmdmodificar 
      BackColor       =   &H0080FF80&
      Caption         =   "Modificar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8520
      Picture         =   "frmclientes.frx":A981
      Style           =   1  'Graphical
      TabIndex        =   13
      Top             =   2760
      Width           =   1815
   End
   Begin VB.CommandButton cmdeliminar 
      BackColor       =   &H0080FF80&
      Caption         =   "Eliminar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8520
      Picture         =   "frmclientes.frx":AC8B
      Style           =   1  'Graphical
      TabIndex        =   12
      Top             =   3840
      Width           =   1815
   End
   Begin VB.CommandButton cmdaceptar 
      BackColor       =   &H0080FF80&
      Caption         =   "Aceptar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8520
      Picture         =   "frmclientes.frx":AF95
      Style           =   1  'Graphical
      TabIndex        =   8
      Top             =   4920
      Width           =   1815
   End
   Begin VB.CommandButton cmdcancelar 
      BackColor       =   &H0080FF80&
      Caption         =   "Cancelar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8520
      Picture         =   "frmclientes.frx":B29F
      Style           =   1  'Graphical
      TabIndex        =   9
      Top             =   6000
      Width           =   1815
   End
   Begin VB.CommandButton cmdbuscar 
      BackColor       =   &H0080FF80&
      Caption         =   "Buscar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   8520
      Picture         =   "frmclientes.frx":B5A9
      Style           =   1  'Graphical
      TabIndex        =   11
      Top             =   7080
      Width           =   1815
   End
   Begin VB.CommandButton cmdsalir 
      BackColor       =   &H000000FF&
      Caption         =   "Salir"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   11.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1095
      Left            =   8520
      Picture         =   "frmclientes.frx":B8B3
      Style           =   1  'Graphical
      TabIndex        =   10
      Top             =   8520
      Width           =   1815
   End
   Begin VB.TextBox txtcodcli 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   585
      Left            =   3720
      Locked          =   -1  'True
      MaxLength       =   5
      TabIndex        =   0
      Top             =   2520
      Width           =   1935
   End
   Begin VB.Label Label1 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "CLIENTES"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   48
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1350
      Left            =   3120
      TabIndex        =   23
      Top             =   0
      Width           =   4965
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Razon social"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   0
      Left            =   240
      TabIndex        =   22
      Top             =   1800
      Width           =   2115
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Direccion"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   1
      Left            =   240
      TabIndex        =   21
      Top             =   3240
      Width           =   1590
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "CUIT"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   2
      Left            =   3720
      TabIndex        =   20
      Top             =   3240
      Width           =   945
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Telefono"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   3
      Left            =   240
      TabIndex        =   19
      Top             =   4680
      Width           =   1515
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   " IVA"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   5
      Left            =   3720
      TabIndex        =   18
      Top             =   4680
      Width           =   855
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Tipo factura"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   6
      Left            =   240
      TabIndex        =   17
      Top             =   6120
      Width           =   2175
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Lista"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   7
      Left            =   3720
      TabIndex        =   16
      Top             =   6120
      Width           =   840
   End
   Begin VB.Label lblleyenda 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Codigo Cliente"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Index           =   8
      Left            =   3720
      TabIndex        =   15
      Top             =   1800
      Width           =   2460
   End
End
Attribute VB_Name = "frmclientes"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub iniciar()
txtrazon.Text = ""
txtdir.Text = ""
cboL.Text = Publico
cbofac.Text = ""
txtcuit.Text = ""
cboci.Text = ""
txttel.Text = ""
txtcodcli.Text = ""
End Sub
Private Sub cargar()
txtrazon.Text = IIf(IsNull(rClientes!razon), "", rClientes!razon)
txtdir.Text = IIf(IsNull(rClientes!direccion), "", rClientes!direccion)
cboL.Text = IIf(IsNull(rClientes!lista), "", rClientes!lista)
cbofac.Text = IIf(IsNull(rClientes!tipofac), "", rClientes!tipofac)
txtcuit.Text = IIf(IsNull(rClientes!cuit), "", rClientes!cuit)
cboci.Text = IIf(IsNull(rClientes!condiva), "", rClientes!condiva)
txttel.Text = IIf(IsNull(rClientes!tel), "", rClientes!tel)
txtcodcli.Text = IIf(IsNull(rClientes!codcli), "", rClientes!codcli)

End Sub


Private Sub cboci_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub cbofac_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub cboL_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub cmdaceptar_Click()
If flag = 1 Then
    rClientes.AddNew
    rContador.Edit
    rContador!codcli = rContador!codcli + 1
    rContador.Update
ElseIf flag = 2 Then
    rClientes.Edit
End If
reemplazar
rClientes.Update
If flag = 1 Then
    If rClientes.RecordCount > 0 Then
        rClientes.MoveLast
        cargar
    Else
        iniciar
    End If
End If
cambiar True
End Sub

Private Sub cmdagregar_Click()
    cambiar False
    flag = 1
    iniciar
    txtcodcli.Text = strzero(rContador!codcli, 5)
    txtrazon.SetFocus
End Sub

Private Sub reemplazar()
rClientes!razon = txtrazon.Text
rClientes!direccion = txtdir.Text
rClientes!cuit = txtcuit.Text
rClientes!tel = txttel.Text
rClientes!condiva = cboci.Text
rClientes!tipofac = cbofac.Text
rClientes!lista = cboL.Text
rClientes!codcli = txtcodcli.Text
End Sub


Private Sub cmdBuscar_Click()
Criterio = InputBox("ingrese el codigo o razon social ")
If Criterio = "" Then
    MsgBox "busqueda cancelada por el usuario...", vbInformation, "mensaje"
Else
    Criterio = Trim(Criterio)
    If IsNumeric(Criterio) Then
        Criterio = String(5 - Len(Criterio), "0") & Criterio
        Campo = "codcli"
    Else
        Campo = "razon"
    End If
    frmclientesbuscar.Show vbModal
    rClientes.FindFirst "codcli='" & Criterio & "'"
    If Not rClientes.NoMatch Then
        cargar
    End If
End If

    
End Sub

Private Sub cmdcancelar_Click()
cambiar True
End Sub

Private Sub cmddesplazar_Click(Index As Integer)
    Select Case Index
        Case 0: rClientes.MoveFirst
        Case 1: rClientes.MovePrevious
            If rClientes.BOF Then rClientes.MoveFirst
        Case 2: rClientes.MoveNext
            If rClientes.EOF Then rClientes.MoveLast
        Case 3: rClientes.MoveLast
    End Select
    cargar
    
End Sub

Private Sub cmdeliminar_Click()
Dim confirma As String
confirma = MsgBox("confirma la eliminacion del registro", vbYesNo, "confirmacion")
        If confirma = vbYes Then
            rClientes.Delete
            rClientes.MoveNext
            If rClientes.EOF Then rClientes.MoveLast
            cargar
            MsgBox "Registro eliminado.....", vbExclamation, "Mensaje"
        Else
            MsgBox "eliminacion cancelada por el usuario", vbExclamation, "Mensaje"
        End If
        
End Sub

Private Sub cmdmodificar_Click()
cambiar False
flag = 2
txtdir.SetFocus
End Sub

Private Sub cambiar(cambio As Boolean)
cmdagregar.Enabled = cambio
cmdmodificar.Enabled = cambio
cmdeliminar.Enabled = cambio
cmdbuscar.Enabled = cambio
cmdsalir.Enabled = cambio

For I = 0 To 3
   cmddesplazar(I).Enabled = cambio
Next
cmdaceptar.Enabled = Not cambio
cmdcancelar.Enabled = Not cambio
txtrazon.Enabled = Not cambio
txtdir.Enabled = Not cambio
txtcuit.Enabled = Not cambio
txttel.Enabled = Not cambio
cboci.Enabled = Not cambio
cboL.Enabled = Not cambio
cbofac.Enabled = Not cambio
txtcodcli.Enabled = Not cambio
End Sub

Private Sub cmdsalir_Click()
Unload Me
End Sub

Private Sub Form_Load()
Set rClientes = miBase.OpenRecordset("clientes", dbOpenDynaset)
cambiar True
If Not rClientes.EOF Then
    rClientes.MoveFirst
    cargar
End If
End Sub







Private Sub txtci_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub txtcodcli_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub






Private Sub Txtcp_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub txtcuit_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

Private Sub txtdir_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub






Private Sub txtrazon_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub



Private Sub txttel_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub



Private Sub txttf_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub


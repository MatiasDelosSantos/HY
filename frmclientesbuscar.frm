VERSION 5.00
Object = "{00028C01-0000-0000-0000-000000000046}#1.0#0"; "DBGRID32.OCX"
Begin VB.Form frmclientesbuscar 
   Caption         =   "Buscar Clientes"
   ClientHeight    =   8070
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   10275
   LinkTopic       =   "Form1"
   ScaleHeight     =   8070
   ScaleWidth      =   10275
   StartUpPosition =   2  'CenterScreen
   Begin VB.TextBox Text1 
      Height          =   495
      Left            =   480
      TabIndex        =   1
      Top             =   7200
      Visible         =   0   'False
      Width           =   1095
   End
   Begin VB.Data Data1 
      Caption         =   "Data1"
      Connect         =   "Access 2000;"
      DatabaseName    =   "HY.mdb"
      DefaultCursorType=   0  'DefaultCursor
      DefaultType     =   2  'UseODBC
      Exclusive       =   0   'False
      Height          =   375
      Left            =   7440
      Options         =   0
      ReadOnly        =   0   'False
      RecordsetType   =   1  'Dynaset
      RecordSource    =   "clientes"
      Top             =   7320
      Visible         =   0   'False
      Width           =   2175
   End
   Begin MSDBGrid.DBGrid DBGrid1 
      Bindings        =   "frmclientesbuscar.frx":0000
      Height          =   8655
      Left            =   0
      OleObjectBlob   =   "frmclientesbuscar.frx":0014
      TabIndex        =   0
      Top             =   0
      Width           =   11535
   End
End
Attribute VB_Name = "frmclientesbuscar"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub DBGrid1_DblClick()
Criterio = Data1.Recordset!codcli
Unload Me
End Sub



Private Sub DBGrid1_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then
    DBGrid1_DblClick
ElseIf KeyCode >= 65 And KeyCode <= 90 Then
    Text1.Text = Text1.Text & Chr(KeyCode)
ElseIf KeyCode >= 48 And KeyCode <= 57 Then
    Text1.Text = Text1.Text & Chr(KeyCode)
ElseIf KeyCode >= 96 And KeyCode <= 105 Then
    Text1.Text = Text1.Text & Chr(KeyCode - 48)
ElseIf KeyCode = 8 Then
    If Text1.Text <> "" Then
        Text1.Text = Left(Text1.Text, Len(Text1.Text) - 1)
    End If
ElseIf KeyCode = 32 Then
    Text1.Text = Text1.Text & " "
ElseIf KeyCode = 190 Then
    Text1.Text = Text1.Text & "."
ElseIf KeyCode = 188 Then
    Text1.Text = Text1.Text & ","
ElseIf KeyCode = 109 Then
    Text1.Text = Text1.Text & "-"
End If

End Sub

Private Sub Form_Activate()
Text1.Text = Criterio

End Sub
Private Sub CargarRecordset()
Data1.RecordSource = "select codcli,razon,cuit from clientes " & _
                    "where " & Campo & " like '" & Text1.Text & "*'" & " order by " & Campo

Data1.Refresh

End Sub

Private Sub Form_Load()
Set miBase = OpenDatabase(App.Path & "\HY.mdb", False, False)
Set rClientesaux = miBase.OpenRecordset("select * from clientes " & "order by " & Campo, dbOpenDynaset)
Set Data1.Recordset = rClientesaux
Data1.Refresh
Data1.Recordset.FindFirst Campo & " like'" & Criterio & "*'"
End Sub

Private Sub Text1_Change()
If Text1.Text = "" Then
    Data1.RecordSource = "Select codcli,razon,cuit from clientes order by " & Campo
    Data1.Refresh
Else
    CargarRecordset
End If
DBGrid1.Caption = "Buscar: " & Campo & " --> " & Text1.Text

End Sub

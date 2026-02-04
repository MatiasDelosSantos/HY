VERSION 5.00
Object = "{00028C01-0000-0000-0000-000000000046}#1.0#0"; "DBGRID32.OCX"
Begin VB.Form frmdetalle 
   Caption         =   "Detalle"
   ClientHeight    =   6660
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   6075
   LinkTopic       =   "Form1"
   ScaleHeight     =   6660
   ScaleWidth      =   6075
   StartUpPosition =   3  'Windows Default
   Begin VB.TextBox Text1 
      Height          =   375
      Left            =   600
      TabIndex        =   1
      Top             =   5760
      Visible         =   0   'False
      Width           =   1095
   End
   Begin VB.Data Data1 
      Caption         =   "Data1"
      Connect         =   "Access"
      DatabaseName    =   ""
      DefaultCursorType=   0  'DefaultCursor
      DefaultType     =   2  'UseODBC
      Exclusive       =   0   'False
      Height          =   375
      Left            =   3600
      Options         =   0
      ReadOnly        =   0   'False
      RecordsetType   =   1  'Dynaset
      RecordSource    =   ""
      Top             =   5760
      Visible         =   0   'False
      Width           =   1935
   End
   Begin MSDBGrid.DBGrid DBGrid1 
      Bindings        =   "frmdetalle.frx":0000
      Height          =   6615
      Left            =   120
      OleObjectBlob   =   "frmdetalle.frx":0014
      TabIndex        =   0
      Top             =   0
      Width           =   5895
   End
End
Attribute VB_Name = "frmdetalle"
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
Data1.RecordSource = "select codcli,razon from remitodetalle " & _
                    "where " & Campo & " like '" & Text1.Text & "*'" & " order by " & Campo

Data1.Refresh

End Sub

Private Sub Form_Load()
Set miBase = OpenDatabase(App.Path & "\HY.mdb", False, False)
Set RremitoAux = miBase.OpenRecordset("select codcli,razon from remitodetalle " & "order by " & Campo, dbOpenDynaset)
Set Data1.Recordset = RremitoAux
Data1.Refresh
Data1.Recordset.FindFirst Campo & " like'" & Criterio & "*'"
End Sub

Private Sub Text1_Change()
If Text1.Text = "" Then
    Data1.RecordSource = "Select codcli,razon from remitodetalle order by " & Campo
    Data1.Refresh
Else
    CargarRecordset
End If
DBGrid1.Caption = "Buscar: " & Campo & " --> " & Text1.Text

End Sub



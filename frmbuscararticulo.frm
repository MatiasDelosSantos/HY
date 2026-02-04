VERSION 5.00
Object = "{00028C01-0000-0000-0000-000000000046}#1.0#0"; "DBGRID32.OCX"
Begin VB.Form frmbuscararticulo 
   Caption         =   "Buscar Articulo"
   ClientHeight    =   8700
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   11505
   LinkTopic       =   "Form1"
   ScaleHeight     =   8700
   ScaleWidth      =   11505
   StartUpPosition =   2  'CenterScreen
   Begin VB.TextBox Text1 
      Height          =   495
      Left            =   360
      TabIndex        =   1
      Top             =   7800
      Visible         =   0   'False
      Width           =   1095
   End
   Begin VB.Data Data1 
      Caption         =   "Data1"
      Connect         =   "Access 2000;"
      DatabaseName    =   ""
      DefaultCursorType=   0  'DefaultCursor
      DefaultType     =   2  'UseODBC
      Exclusive       =   0   'False
      Height          =   375
      Left            =   8160
      Options         =   0
      ReadOnly        =   0   'False
      RecordsetType   =   1  'Dynaset
      RecordSource    =   ""
      Top             =   7920
      Visible         =   0   'False
      Width           =   2055
   End
   Begin MSDBGrid.DBGrid DBGrid1 
      Bindings        =   "frmbuscararticulo.frx":0000
      Height          =   8655
      Left            =   0
      OleObjectBlob   =   "frmbuscararticulo.frx":0014
      TabIndex        =   0
      Top             =   0
      Width           =   11535
   End
End
Attribute VB_Name = "frmbuscararticulo"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub DBGrid1_DblClick()
Criterio = Data1.Recordset!codigo

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
Data1.RecordSource = "select codigo,marca,codfab,descripcion from articulos " & _
                    "where " & Campo & " like '" & Text1.Text & "*'" & " order by " & Campo

Data1.Refresh

End Sub

Private Sub Form_Load()
Set miBase = OpenDatabase(App.Path & "\HY.mdb", False, False)
Set rArtaux = miBase.OpenRecordset("select * from articulos " & "order by " & Campo, dbOpenDynaset)
Set Data1.Recordset = rArtaux
Data1.Refresh
Data1.Recordset.FindFirst Campo & " like'" & Criterio & "*'"
End Sub

Private Sub Text1_Change()
If Text1.Text = "" Then
    Data1.RecordSource = "Select codigo,marca,codfab,descripcion from articulos order by " & Campo
    Data1.Refresh
Else
    CargarRecordset
End If
DBGrid1.Caption = "Buscar: " & Campo & " --> " & Text1.Text
'If Text1.Text <> "" Then
   'Data1.Recordset.FindFirst Campo & " like'" & Text1.Text & "*'"
'Else
    'Data1.Recordset.MoveFirst
'End If
'DBGrid1.Caption = "buscar el campo" & Campo & ":" & Text1.Text
'DBGrid1.SetFocus
End Sub


